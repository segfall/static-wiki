<script>
    import { navigate } from "svelte-routing";
    import { tick } from 'svelte';
    import SvelteMarkdown from 'svelte-markdown'
    import ArticleHeading from "./ArticleHeading.svelte";
    import ArticleLink from "./ArticleLink.svelte";
    import ArticleHtml from "./ArticleHtml.svelte";
    import ArticleImage from "./ArticleImage.svelte";
    import db from "../db";

    export let worker;
    export let name = "";
    export let dbKey = "";

    let redirected = false;

    let toc;
    let root;
    let title;
    let error;
    let text;
    let loading = false;
    let contents = [];

    const buildTableOfContents = () => {
        let contents = [];
        try {
            for (let line of text.split("\n")) {
                line = line.trim();
                if (line[0] === "#") {
                    if (line[1] === "#") {
                        if (line[2] !== "#") {
                            contents.push({
                                name: line.replace(/#/g, '').trim(),
                                headings: []
                            })
                        } else {
                            if (line[3] !== "#") {
                                contents.slice(-1)[0].headings.push({
                                    name: line.replace(/#/g, '').trim(),
                                    headings: []
                                });
                            } else {
                                contents.slice(-1)[0].headings.slice(-1)[0].headings.push({
                                    name: line.replace(/#/g, '').trim()
                                });
                            }
                        }
                    }
                }
            }
        } catch(err) {}
        return contents;
    }

    let updateNaming = false;

    const updateText = async (results) => {
        document.title = title = results[0].values[0][0];
        if (name.split("_").join(" ") !== title) {
            const newName = title.split(" ").join("_");
            updateNaming = true;
            navigate(newName, {replace: true});
        }
        console.log("rendering");
        text = results[0].values[0][1];
        contents = buildTableOfContents();

        await tick();

        const selectedHeading = document.getElementById(
            decodeURI(window.location.hash.replace("#", ""))
        );

        const img = document.getElementById("info-image");
        if (img) {
            let tbody = document.createElement('tbody');
            tbody.innerHTML = `<tr><td colspan="2" style="text-align: center"></td></tr>`;
            tbody.getElementsByTagName('td')[0].appendChild(img);
            document.getElementsByTagName("table")[0].prepend(tbody);
        }

        if (document.body.clientWidth < 500) {
            let p = root.querySelector("p");
            let h1 = root.querySelector("h1");
            let small = root.querySelector("small");
            p.parentElement.prepend(p);
            small && p.parentElement.prepend(small);
            p.parentElement.prepend(h1);

            [...document.getElementsByTagName("h2")].forEach(el => {
                if (el === selectedHeading) {
                    return;
                }
                el.click();
            });
        }

        let h2 = root.querySelector("h2");
        h2 && toc && h2.parentNode.insertBefore(toc, h2)


        if (selectedHeading) {
            selectedHeading.scrollIntoView(true);
        }
    }

    const handle = function(results) {
        console.log(results);
        loading = false;
        let title = name.split("_").join(" ");
        if (!results || !results[0] || !results[0].values[0]) {
            error = `"${title}" could not be found in ${db[dbKey].name}`;
            document.title = "404 not found";
            return;
        }
        const redirect = !results[0].values[0][1] && results[0].values[0][2];
        if (redirect) {
            console.log("redirecting to...", redirect)
            redirected = {
                from: title,
                to: redirect
            };
            navigate("/" + dbKey + "/" + redirect.split(" ").join("_"), { replace: true });
            return;
        }
        return updateText(results);
    }

    const goTo = (to) => {
        if (updateNaming) {
            updateNaming = false;
            return;
        }
        loading = true;
        text = undefined;
        error = false;
        title = name.split("_").join(" ");
        console.log("kicking off worker", to);
        if (redirected && redirected.to !== title) {
            console.log(redirected, title);
            redirected = null;
        }
        window.scrollTo(0, 0);
        worker.db.exec(
            `select * from wiki_articles where title = ?`,
            [title]
        ).then(handle)
    }

    $ : {
        if (name !== undefined) {
            dbKey = dbKey // force this block to react to dbKey changes
            goTo(name);
        }
    }

</script>

<main bind:this={root}>
    <img src="/spinner.gif" id="spinner" style="float: none;  margin: auto; margin-top: 60px; display: {loading && text === undefined ? 'block' : 'none'}" />
    {#if error}
        <div class="error">{error}</div>
    {:else}
        {#if text !== undefined}
            <div class="article">
                <h1>{title.replace(/_/g, " ")}</h1>
                {#if redirected && redirected.to !== name}
                    <small style="margin-top: -8px; margin-bottom: 10px; display: block"><em>Redirected from "{redirected.from}"</em></small>
                {/if}
                {#if contents.length > 1}
                    <div>
                        <nav bind:this={toc}>
                            <strong>Contents</strong>
                            {#each contents as content, i}
                                <ul>
                                    <li>
                                        {i+1}  <a href="#{content.name.replace(/ /g, '_')}"> {content.name}</a>
                                        {#if content.headings.length > 0}
                                            <ul>
                                                {#each content.headings as content, n}
                                                    <li>
                                                        {i+1}.{n+1}  <a href="#{content.name.replace(/ /g, '_')}">{content.name}</a>
                                                        {#if content.headings.length > 0}
                                                            <ul>
                                                                {#each content.headings as content, x}
                                                                    <li>
                                                                        {i+1}.{n+1}.{x+1}  <a href="#{content.name.replace(/ /g, '_')}">{content.name}</a>
                                                                    </li>
                                                                {/each}
                                                            </ul>
                                                        {/if}
                                                    </li>
                                                {/each}
                                            </ul>
                                        {/if}
                                    </li>
                                </ul>
                            {/each}
                        </nav>
                    </div>
                {/if}
                <SvelteMarkdown source={text} renderers={{
                     heading: ArticleHeading,
                     link: ArticleLink,
                     html: ArticleHtml,
                     image: ArticleImage
                }} />
            </div>
        {/if}
    {/if}
</main>

<style>
    main {
        text-align: left;
        max-width: 900px;
        margin: auto;
    }
    h3 {
        margin: none;
    }
    .error {
        color: gray;
        text-align: center;
        padding-top: 20px;
    }
    :global(table) {
        float: right;
        margin-left: 10px;
        margin-bottom: 10px;
        border: 1px solid lightgray;
        font-size: .85rem;
        clear: both;
    }

    :global(table:first-of-type) {
        width: 40%;
    }

    :global(#info-image) {
        float: none;
        clear: none;
        margin: auto;
        max-width: 98%;
        max-height: 250px;
    }

    @media screen and (max-width:600px) {
        :global(table) {
            width: 100%;
            float: none;
            margin: auto;
            margin-top: 10px;
            margin-bottom: 10px;
        }
    }

    :global(ul) :global(ol) {
        list-style: none;
        padding: 0px;
    }

    :global(td) {
        min-width: 120px;
    }

    nav {
        background: #f8f9fa;
        display: inline-block;
        border: 1px solid #a2a9b1;
        padding: 1rem;
        font-size: 15px;
    }

    nav ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    nav ul ul {
        margin-left: 1.5rem;
    }

    nav a {
        display: inline-block;
        padding-top: .15rem;
        padding-bottom: .15rem;
    }

    @media screen and (max-width:600px) {
        nav {
            display: none;
        }
        h1 {
            margin-top: 1rem;
        }
    }


</style>