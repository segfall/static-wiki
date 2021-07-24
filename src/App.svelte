<script>
    import {Router, Route, navigate } from "svelte-routing";
    import {onMount} from "svelte";

    import db from "../db";
    import createWorker from "./sqlite";
    import Article from "./Article.svelte"
    import Search from "./Search.svelte"
    import Intro from "./Intro.svelte"
    import Autocomplete from "./Autocomplete.svelte";

    let databasesArr = Object.entries(db);
    let databases = Object.fromEntries(databasesArr.map(database => [ database[0] ]));

    let dbKey = window.location.pathname.split("/")[1] || "en";

    let worker = {
      terminate() {
        // console.log(dbKey);
        // databases[dbKey].worker.postMessage("stop");
        // databases[dbKey] = null;
        // databases[dbKey].worker.terminate();
        // console.log("DFSDKJFSDKJSDJKFSDKJFSDKJFDSKJDSF");
      },
      db: {
        exec() {
          let path = window.location.pathname.split("/")[1];
          let args = arguments;
          let execute = () => { return databases[dbKey].db.exec(...args) };
          dbKey = !(path in databases) ? "en" : path;
          if (!databases[dbKey]) {
            console.log("worker does not exist, so we need to start it");
            databases[dbKey] = startWorker();
          }
          if (databases[dbKey].then) {
            console.log("worker is about to exist, so lets add this request on the queue");
            databases[dbKey] = databases[dbKey].then(execute);
            return databases[dbKey];
          }
          return execute();
        }
      }
    }

    const updateDbKey = () => {
      let path = window.location.pathname.split("/")[1];
      let dbPath = '/' + dbKey + '/';
      if (path !== dbKey) {
        if (path || dbKey !== 'en') {
          let newPath = dbPath;
          let slice = window.location.pathname.split("/");
          if (slice.length > 2) {
            newPath += slice.slice(-1)[0];
          }
          navigate(newPath);
        }
      }
      console.log("Now using " + dbKey);
    }

    async function startWorker() {
      console.log("starting worker");
      // only change the opacity if this isn't the first db that's being connected to.
      if (Object.values(databases).filter(val => val).length > 0) {
        document.body.style.opacity = ".5";
      }
      let ready = await createWorker(dbKey)
      document.body.style.opacity = "1";
      console.log("called 2");
      databases[dbKey] = ready;
      window.databases = databases;
      updateDbKey();
    }

    $: {
      if (!(dbKey in databases)) {
        dbKey = 'en';
      }
      if (!databases[dbKey]) {
        startWorker();
      } else {
        updateDbKey();
      }
    }

    onMount(() => {
        document.title = "static.wiki";
    });

</script>

<Router>
  <select bind:value={dbKey} on:change={e => { dbKey = e.target.value}} class="hide-on-mobile">
    {#each databasesArr as db}
      <option value={db[0]}>
        {db[1].name}
      </option>
    {/each}
  </select>
  <main>
    <div class="mobile-header show-on-mobile">
      <a href={dbKey === "en" ? "/" : "/" + dbKey + "/"} class="small-logo show-on-mobile">
        static
        wiki
      </a>
      <Autocomplete worker={worker} dbKey={dbKey} />
      <select bind:value={dbKey} on:change={e => { dbKey = e.target.value}} class="show-on-mobile">
        {#each databasesArr as db}
          <option value={db[0]}>
            {db[1].name}
          </option>
        {/each}
      </select>
    </div>
    <h1 class="hide-on-mobile">
      <a href={dbKey === "en" ? "/" : "/" + dbKey + "/"}>
        static.wiki
      </a>
    </h1>
    <div class="content">
      <div class="hide-on-mobile">
        <Autocomplete worker={worker} dbKey={dbKey} />
      </div>
      <Route path="" component={Intro} worker={worker} dbKey={dbKey} />
      {#each databasesArr as db}
        <Route path={db[0]} component={Intro} worker={worker} dbKey={db[0]} />
      {/each}
      <Route path=":dbKey/search/:query" component={Search} worker={worker} />
      <Route path=":dbKey/*name" component={Article} worker={worker} />
    </div>
  </main>
  <footer>

  </footer>
</Router>

<style>

  :global(body) {
    overflow-y: scroll;
  }

  main {
    text-align: center;
    margin: 0 auto;
    min-height: 100vh;
    background: white;
  }

  h1 {
    font-size: 1.75rem;
    font-weight: bold;
    line-height: 1.1;
    max-width: 14rem;
    margin: auto;
    margin-bottom: 0px;
    padding-top: 2rem;
  }

  h1 :global(a) {
    text-decoration: none;
    color: #0645ad;
  }
  :global(a) {
    color: #0645ad;
    text-decoration: none;
  }

  :global(a:hover) {
    text-decoration: underline;
  }

  h1 :global(a:hover) {
    text-decoration: underline;
  }

  h4 {
    margin: 0;
    margin-top: .25rem;
  }

  :global(html) {
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif; /* 1 */
    font-size: 100%;
    line-height: 1.6;
    -webkit-text-size-adjust: 100%;
    word-break: break-word;
  }

  :global(h1),:global(h2),:global(h3),:global(h4),:global(h5),:global(h6) {
    margin: 2.2rem 0 .6em;
  }

  .content {
    padding: 1em;
  }

  select {
    float: right;
  }

  footer {
    display: none;
  }

  :global(body) {
    padding: 0;
    margin: 0;
  }

  .show-on-mobile {
    display: none;
  }

  .small-logo {
    padding: 5px;
    padding-right: 10px;
    padding-left: 8px;
    font-size: 14px;
    font-weight: bold;
    width: 52px;
    text-align: center;
  }

  @media screen and (max-width:600px) {
    :global(.closed-on-mobile) {
      display: none;
    }

    footer {
      background: whitesmoke;
      border-top: 1px solid lightgray;
      min-height: 50vh;
      display: block;
    }

    main {
      min-height: 150vh;
    }

    select {
      width: 70px;
      display: block;
      height: 48px
    }

    .hide-on-mobile {
      display: none;
    }

    .show-on-mobile {
      display: block
    }

    .mobile-header {
      display: flex;
      align-items: center;
      background: whitesmoke;
      border: 2px solid rgba(0,0,0,.1);
    }

    :global(body) {
      overflow-x: hidden;
    }

  }



</style>
