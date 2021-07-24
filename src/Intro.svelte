<script>
    export let dbKey;
</script>

<div style="margin-top: 20px">
    <p>
        <small>
            {#if !dbKey || dbKey === "en"}
                read-only wikipedia using just static files.<br/>
                2MB of CSS, JS, WASM; one 43GB SQLite file.<br/>
                ⚠️ autocomplete is slow & eats 500kb+ per search<br/>
                check out the <a href="https://github.com/segfall/static-wiki" target="_blank">github repo</a> for details on this proof-of-concept<br/>
            {/if}
            {#if dbKey === "zh"}
                仅使用静态文件的只读维基百科。<br/>
                2MB 的 CSS、JS、WASM；一个 5.67GB 的 SQLite 文件。<br/>
                ⚠️ 自动完成很慢，每次搜索消耗 500kb+<br/>
                查看 <a href="https://github.com/segfall/static-wiki" target="_blank">github 存储库</a>，了解有关此概念验证的详细信息<br/>
            {/if}
            {#if dbKey === "fr"}
                wikipedia en lecture seule utilisant uniquement des fichiers statiques.<br/>
                2 Mo de CSS, JS, WASM ; un fichier SQLite de 14.77 Go.<br/>
                ⚠️ la saisie semi-automatique est lente et consomme plus de 500 ko par recherche<br/>
                consultez le <a href="https://github.com/segfall/static-wiki" target="_blank">repo github</a> pour plus de détails sur cette preuve de concept<br/>
            {/if}
            {#if dbKey === "simple"}
                wikipedia with files, no backend. it's slow.<br/>
                check out the <a href="https://github.com/segfall/static-wiki" target="_blank">repo</a> for details<br/>
            {/if}
            {#if dbKey === "wikiquote"}
                "No one wants to download a megabyte on every key press in a form input"<br/>
                check out the <a href="https://github.com/segfall/static-wiki" target="_blank">github repo</a> for details on this proof-of-concept<br/>
            {/if}
        </small>
    </p>
</div>