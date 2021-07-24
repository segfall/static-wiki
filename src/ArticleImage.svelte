<script>
    export let href = ''
    export let title = undefined
    export let text = ''

    import SvelteMarkdown from 'svelte-markdown'
    import ArticleLink from "./ArticleLink.svelte";
    import decode from 'unescape';

    let alt = text.split("|||")[0];
    let caption = text.split("|||")[1] && decode(text.split("|||")[1].replace(/\\/g, "").replace('&#39;', ''));

</script>

<div>
    <img src={href} {title} alt={alt}>
    <caption>
        <SvelteMarkdown source={caption} renderers={{link: ArticleLink}} />
    </caption>
</div>

<style>
    div {
        float: right;
        margin: 10px;
        clear: both;
        border: 1px solid #c8ccd1;
        padding: 3px;
        background-color: #f8f9fa;
        text-align: center;
        overflow: hidden;
        font-size: 12px;
        max-width: 240px;
    }
    caption {
        display: block;
        text-align: left;
        padding-left: 2px;
        padding-right: 2px;
    }
    img {
        max-width: 100%;
    }
    div :global(p) {
        margin-top: 2px;
        margin-bottom: 2px;
    }

    @media screen and (max-width:600px) {
        div {
            float: none;
            display: block;
            margin: auto;
            margin-bottom: 1rem;
            margin-top: 1rem;
        }
    }
</style>