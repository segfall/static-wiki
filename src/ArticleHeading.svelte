<script>
    export let depth
    export let raw
    let slotObj = {};
    let id;

    const toggle = (e) => {
        let el = e.target;
        el.classList.toggle("open");
        el = el.nextElementSibling
        while (el && el.tagName !== "H2") {
            el.classList.toggle("closed-on-mobile");
            el = el.nextElementSibling;
        }
    }

    $: id = slotObj.textContent && slotObj.textContent.split(" ").join("_");


</script>

{#if depth === 1}
    <h1><slot></slot></h1>
{:else if depth === 2}
    <h2 on:click={toggle} id={id} bind:this={slotObj}><slot></slot></h2>
{:else if depth === 3}
    <h3 id={id} bind:this={slotObj}><slot></slot></h3>
{:else if depth === 4}
    <h4 id={id} bind:this={slotObj}><slot></slot></h4>
{:else if depth === 5}
    <h5 id={id} bind:this={slotObj}><slot></slot></h5>
{:else if depth === 6}
    <h6 id={id} bind:this={slotObj}><slot></slot></h6>
{:else}
    {raw}
{/if}

<style>
    @media screen and (max-width:600px) {
        h2 {
            border-bottom: 1px solid rgba(0,0,0, .1);
            padding-bottom: 6px;
            font-weight: normal;
            margin-top: 0;
            display: flex;
        }

        h2:before {
            content: "›";
            transform: rotate(90deg) translateX(12px) translateY(-4px);
            display: inline-block;
            min-width: 20px;
            height: 20px;
        }
        h2:global(.open):before {
            content: "›";
            transform: translateY(-2px);
            display: inline-block;
            min-width: 20px;
            height: 20px;
        }
    }
</style>