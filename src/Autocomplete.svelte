
<script>
    /**
     *  A custom, one-off autocomplete that mirrors Wikipedia's autocomplete.
     */
    import { Link, navigate } from "svelte-routing";
    import highlightWords from "highlight-words";
    import {onMount} from "svelte";
    import db from "../db";


    export let worker;
    export let dbKey;

    let error;
    let input;

    let requestId = 0;

    onMount(() => {
        if (window.location.pathname.includes("/search/")) {
            input.value = decodeURI(window.location.pathname.slice(window.location.pathname.lastIndexOf("/")+1)).replace(/\+/g, " ");
        }
    })

    let loadingOptions = false;
    let options = [];
    let selectedIndex;
    let debouncer;
    let quickLookLoading = false;

    const upDown = e => {
        if (e.key === "ArrowDown") {
            selectedIndex = selectedIndex + 1 >= options.length ? 0: selectedIndex + 1
            let { value } = options[selectedIndex] || {};
            if (value) {
                e.target.value = value;
            }
            e.preventDefault();
        } else if (e.key === "ArrowUp") {
            selectedIndex = selectedIndex - 1 < 0 ? options.length - 1 : selectedIndex - 1;
            let { value } = options[selectedIndex] || {};
            if (value) {
                e.target.value = value;
            }
            e.preventDefault();
        } else if (e.key === "Escape") {
            options = [];
        }
    }

    const generateOptions = (results, term) => {
        let options;
        const values = results[0] && results[0].values;
        options = values ? values.map(value => ({
            label: highlightWords({ text: value[0], query: term }),
            value: value[0],
            link:  "/" + dbKey + "/" + value[0].split(" ").join('_')
        })).sort((a, b) => a.value.length - b.value.length) : [];
        return options;
    }

    const stopLoading = () => {
        if (!loadingOptions) {
            return;
        }
        requestId++;
        loadingOptions = false;
        error = null;
        worker.terminate();
    }

    const inputSearch =  e => {
        if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === "Escape") {
            return;
        }
        let term = e.target.value;
        if (term.length > 0) {
            clearTimeout(debouncer)
            debouncer = setTimeout(async () => {
                options = [];
                loadingOptions = true;
                quickLookLoading = true;
                let results;
                let startRequestId = requestId;
                console.log(term.split(/\s/g, '%'));
                try {
                    results = await worker.db.exec(`select title from wiki_articles where title = ? limit 1`, [term]);
                    options = generateOptions(results, term);
                    selectedIndex = -1;
                    quickLookLoading = false;
                    results = await worker.db.exec(
                        `select title from wiki_title_search where search_title LIKE ? limit 4`,
                        [term.split(/\s/g).join('%').replace(/\s/g, '').replace(/'/g, '').replace(/"/g, '').replace(/:/g, '').replace(/\(/g, '').replace(/\)/g, '') + "%"]
                    )
                } catch (err) {
                    if (loadingOptions) {
                        error = err;
                    }
                    loadingOptions = false;
                    throw error;
                }
                error = false;
                loadingOptions = false;
                if (requestId > startRequestId) {
                    return;
                }
                requestId++;
                let searchedOptions = generateOptions(results, term);
                if (options.length > 0 && searchedOptions[0].value === options[0].value) {
                    options = searchedOptions;
                } else {
                    options = options.concat(searchedOptions)
                }
                if (db[dbKey].articleSearchIndex) {
                    options.push({
                        value: term,
                        label: highlightWords({text: "Search for " + term, query: term}),
                        link: '/' + dbKey + '/search/' + term.split(" ").join('+'),
                        italic: true
                    })
                }
            }, 500);
        }
        if (e.key !== "Enter") {
            return;
        }
        error = false;
        clearTimeout(debouncer);
        let nav = navigate;
        let forceLoad = false;
        if (loadingOptions) {
            forceLoad = true;
            nav = (link) => {
                window.location.href = link;
            }
        }
        stopLoading();
        if (options[selectedIndex]) {
            nav(options[selectedIndex].link);
            input.value = '';
        } else {
            if (forceLoad) {
                window.location.href = "/" + dbKey + "/" + input.value.split(" ").join('_');
                return;
            }
            worker.db.exec(`select * from wiki_articles where title = ? limit 1`, [term])
                .then(result => {
                    input.value = '';
                    let next = result[0] && (result[0].values[0][0] || result[0].values[0][1]);
                    if (next) {
                        nav("/" + dbKey + "/" + next.split(" ").join('_'));
                        return;
                    }
                    nav("/" + dbKey + "/search/" + encodeURI(term).replace(/%20/g, "+"));
                })
        }
        options = [];
    }

    document.addEventListener('sticky-change', e => {
        const sticking = e.detail.stuck; // true when header is sticky.
        input.classList.toggle('shadow', sticking); // add drop shadow when sticking.
    });


</script>


{#if options.length > 0 || loadingOptions}
    <div class="modal" on:click={() => {options=[]; stopLoading()}}>

    </div>
{/if}

<div class="autocomplete" on:keyup={inputSearch} on:keydown={upDown}>
    <input type="text"
           placeholder={"search"}
           bind:this={input}
    >
    {#if options.length > 0 || loadingOptions || error}
        {#if !quickLookLoading}
            <div class="options" on:click={e => {
                options = [];
                let href = e.target.href || e.target.parentElement.href;
                if (loadingOptions && href) {
                    document.getElementById("spinner").style.display = 'none';
                    window.location.href = href;
                }
                input.value = '';
                stopLoading()
            }
            } style="min-height: {loadingOptions && options.length === 1 ? '60px' : '30px'}">
                {#if error && !loadingOptions}
                    <div class="error">
                        {error}
                    </div>
                {/if}
                {#each options as option, i}
                    <div class="option" class:selected={selectedIndex === i} on:mouseenter={() => {selectedIndex = i}} style="font-style: {option.italic ? 'italic' : ''}">
                        <Link to={option.link}>
                            {#each option.label as chunk(chunk.key)}
                                <span class:highlight="{chunk.match}">{chunk.text}</span>
                            {/each}
                        </Link>
                    </div>
                {/each}
                <div class="autocomplete-looking" style="display: {loadingOptions ? 'block' : 'none'};" on:click={e => {
                    e.preventDefault()
                    e.stopPropagation();
                }}>
                    <em><small>looking for other articles<span class="loading"></span></small></em>
                </div>
            </div>
        {/if}
    {/if}
</div>


<style>
    .autocomplete-looking {
        color: gray;
        text-align: center;
        position: absolute;
        bottom: 0px;
        left: 0px;
        right: 0px;
        padding-bottom: 4px;
    }

    .loading:after {
        overflow: hidden;
        display: inline-block;
        position: absolute;
        bottom: 5px;
        vertical-align: bottom;
        animation: ellipsis steps(4,end) 1800ms infinite;
        content: "\2026";
        width: 0px;
    }

    @keyframes ellipsis {
        to {
            width: 20px;
        }
    }

    .autocomplete {
        width: 240px;
        margin: auto;
        z-index: 10;
        position: relative;
        /*position: -webkit-sticky;*/
        /*position: sticky;*/
        /*top: 10px;*/
    }

    .modal {
        position: fixed;
        z-index: 9;
        left:0;
        right: 0;
        bottom: 0;
        top: 0;
    }

    input {
        font-size: 1rem;
        padding: 14px;
        border-radius: 3px;
        border: 1px solid rgba(0,0,0, 0.25);
        width: 210px;
    }

    :global(.autocomplete:after) {
        display: none !important;
    }

    :global(.autocomplete) {
        font-family: Arial !important;
    }

    .error {
        color: red;
        padding: 5px;
        font-size: 13px;
    }

    :global(.selectContainer) {
        font-family: Arial !important;
        font-size: 14px;
    }

    .options {
        box-shadow: rgba(44, 62, 80, 0.25) 0px 2px 3px 0px;
        border: 1px solid lightgray;
        position: absolute;
        left: 0px;
        right: 0px;
        background: white;
        border-radius: 4px;
        text-align: left;
        font-family: Arial;
    }

    .option :global(a) {
        text-decoration: none;
        color: black;
        padding: 5px;
        padding-left: 13px;
        display: block;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .option.selected :global(a) {
        background: #bbd9ff;
    }

    .highlight {
        font-weight: bold;
    }

    img {
        width: 30px;
        height: 30px;
        margin: auto;
        margin-top: 4px;
    }

    @media screen and (max-width:600px) {
        input {
            border: 1px solid rgba(0,0,0,.1);
        }
        .autocomplete {
            margin: 0;
            width: 220px;
        }
        input {
            width: 190px;
        }
    }
</style>