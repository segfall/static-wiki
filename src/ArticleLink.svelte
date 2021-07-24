<script>
    import { Link } from "svelte-routing"

    export let href = ''
    export let title = undefined;

    let root = window.location.pathname.split("/")[1];

    let regex = /https?:\/\/(.*)\.wikipedia\.org\/wiki\/(.*)/;

</script>

{#if href.includes("www.") || href.includes("http://")}
    {#if href.match(regex)}
        <Link to={href.match(regex)[1].replace(".", "") + "/" + href.match(regex)[2]} {title}><slot></slot></Link>
    {:else}
        <a href={href} target="_blank" {title} class="external"><slot></slot></a>
    {/if}
{:else}
    <Link to={"/" + root + "/" + href} {title}><slot></slot></Link>
{/if}

<style>
    .external {
        background: url('/external.svg') center right no-repeat;
        background-size: contain;
        padding-right: 20px;
    }
</style>