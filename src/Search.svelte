<script>
    import { Link } from "svelte-routing";
    import highlightWords from "highlight-words";
    import db from "../db";

    export let dbKey;
    export let worker;
    export let query;

    let results;
    let loading = false;

    const setResults = (dbResults) => {
        loading = false;
        results = dbResults[0] ? dbResults[0].values.map(value => {
            let text = "";
            try {
                text = highlightWords({
                    text: value[1],
                    query: query.split("+").join(" "),
                    clipBy: 20
                });
                text = text.slice(0, 80);
            } catch (err) {
                console.error(err, value[1]);
            }
            return {
                title: value[0],
                text
            }
        }) : [];
    }

    $ : {
        loading = true;
        document.title = "Searching: " + query.split("+").join(" ");
        console.log(query)
        worker.db.exec(
            `select * from wiki_article_search where text match ? LIMIT 5`,
            [query]
        ).then(setResults)
    }

</script>

{#if results !== undefined}
    {#if results.length === 0 && !loading}
        <div class="arial" style="margin-top: 30px; color: gray;">
            No results. {!db[dbKey].articleSearchIndex ? `Full-text search has been disabled for ${db[dbKey].name}.` : ""}
        </div>
    {/if}
    <div class="results" style="opacity: {loading ? .5 : 1}">
        {#each results as result}
            <div class="result">
                <Link to={"/" + dbKey + "/" + result.title.split(" ").join("_")}>
                    <h4>{result.title}</h4>
                </Link>
                <div class="text">
                {#each result.text as chunk(chunk.key)}
                  <span class:highlight="{chunk.match}">{chunk.text}</span>
                {/each}
              </div>
            </div>
        {/each}
    </div>
{:else}
    <img src="/book.gif" style="margin: auto; margin-top: 60px; opacity: .5; float: none; display: {loading ? 'block' : 'none'}; " />
{/if}

<style>

    .results {
        margin-bottom: 4em;
    }

    .results :global(.result) {
        max-width: 640px;
        padding: 8px;
        margin: auto;
        margin-top: 2rem;
        display: block;
        text-decoration: none;
        color: black;
    }

    .text {
        font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif;
        text-align: left;
        text-overflow: ellipsis;
    }

    .highlight {
        background: #bbd9ff;
    }

</style>