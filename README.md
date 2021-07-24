<div align="center">
  <h3><a href='http://static.wiki'><b>http://static.wiki</b></a></h3>
  <img src="http://static.wiki/screenshot.png?4" width="300"/>
  <div><em>Build a read-only Wikipedia using CSS, JS, WASM, and SQLite</em></div>
</div>

<img src="https://img.spacergif.org/v1/spacer.gif" width="1" height="5">

A proof-of-concept inspired and enabled by [Hosting SQLite Databases on Github Pages](https://phiresky.github.io/blog/2021/hosting-sqlite-databases-on-github-pages/) and the ensuing [Hacker News post](https://news.ycombinator.com/item?id=27016630). 
The compiled [single-page app](https://en.wikipedia.org/wiki/Single-page_application) supports autocomplete for titles, automatic redirecting & other MediaWiki datasets like WikiQuote or Chinese Wikipedia. 
It makes no external API calls except to get Wikipedia's images.

<img src="https://img.spacergif.org/v1/spacer.gif" width="1" height="10">
<div align="center"><img height="25px" src="https://svgsilh.com/svg/2461548.svg"/></div>
<img src="https://img.spacergif.org/v1/spacer.gif" width="1" height="10">
<img src="https://img.spacergif.org/v1/spacer.gif" width="1" height="10">


## Known Limitations
The compiled app is **not production ready** and is bandwidth intensive. It will eat your phone's data plan. Here are some other shortcomings:

### Autocomplete is slow
500ms after your last keypress, the app checks if an article matches your input exactly. 
Then, it searches through an index of 7.3 million article titles for 3 similar matches. 
Improving the performance of the search requires modifying SQLite or switching to a different WASM/index altogether. 
See this [thread](https://github.com/phiresky/sql.js-httpvfs/issues/10) for details

### Autocomplete is stuck / the page won't load any more content
If your page is stuck, please try refreshing it. 
I could not find a way to terminate an ongoing request in the SQLite HttpVFS library.

### The `/search/` page always shows "no results"
This feature is currently disabled for `en.db` and a few others. 
Article search is even slower than the autocomplete and will lead to the page crashing.

### Some wikipages look funny or are incomplete
Any mediawiki syntax/wikitext that can't be easily converted to markdown is stripped out and ignored.
Check out [wtf_wikipedia](https://github.com/spencermountain/wtf_wikipedia) for details around the difficulties of parsing wikitext.

<img src="https://img.spacergif.org/v1/spacer.gif" width="1" height="10">
<div align="center"><img height="25px" src="https://svgsilh.com/svg/2461548.svg"/></div>
<img src="https://img.spacergif.org/v1/spacer.gif" width="1" height="10">
<img src="https://img.spacergif.org/v1/spacer.gif" width="1" height="10">


## Building the app
*Just want the db files? Download them from [Kaggle](https://www.kaggle.com/segfall/markdownlike-wikipedia-dumps-in-sqlite)*

Watch out ⚠️ The codebase is filled with spaghetti. It's all glued together and will likely not be maintained. 
If you want to compile the app anyway, here are the steps:

### 1. Get a wikipedia dump
Go to the [wikipedia dump website](https://dumps.wikimedia.org/) and choose your desired language and the latest date.
On the index page, select the file that resembles `<languageofchoice>wiki-<dateofbackup>-pages-articles-multistream.xml.bz2` and save the largest archive.
Once it's downloaded, extract the xml file from the archive. If you chose the English dump, you'll have a ~90GB uncompressed xml to play with.

### 2. Process the xml into a SQLite db
Run `npm install` in the repo.

Then, stream the xml file into the converter.
`cat "/path/to/enwiki.xml" | node ./scripts/xml_to_sqlite.js /path/to/output/folder/en.db`

A new SQLite file will be created at the directory and path you specified.
For comparison, conversion for English wikipedia produces a 43 GB db file. It takes ~10 hours on 15" 2014 Macbook Pro and will require 100GB+ of space (excluding the xml dump file)

You can run `./scripts/sqlite3 /path/to/output/folder/en.db` to see app-ready data.

### 3. Build the frontend assets
Run `npm run build`  and it will compile "src/" into "dist/". See the [Vite docs](https://github.com/vitejs/vite) for more info on how SPA builds.

If you want to test the SQLite db with your local assets, you can
run `npm run build` and `npm run serve` in conjunction with a local nginx service to serve the SQLite db separately.
Check out the [sample nginx.conf](./nginx.conf) which, if you're on Mac, you can use to replace `/usr/local/etc/nginx/nginx.conf`.

Be sure to adjust the dev urls in `db.js` to point to your localhost-served "en.db". 

##### But what about hot-reloading? Why can't I just drop the db file in the dist folder and execute `npm run dev`?
The Vite dev-server does not seem to emit the "Accept-Range" header which is required by the SQLite HttpVFS library.
`npm run dev` also crashes after reloading the SQLite library a few times, for some reason.

### 4. Deploy "dist/" and "db/" to static file hosts
Upload the dist files to your S3 bucket, github pages, surge, vercel, or any static file host.
The "db/" directory must be uploaded to a CORS friendly host that supports/emits an "Accept-Range" Header.
Setting up cross-domain CORS on a static host is a real pain so I've included [sample CORS config for S3](./CORS.example) as a point-of-reference.

Finally, adjust the production urls in `db.js`. With that, your app should be ready to be deployed.

### 5. Repeat for other wikimedia dumps
If you want to try other dbs, just follow steps 1-4 and add them to `db.js`.

<img src="https://img.spacergif.org/v1/spacer.gif" width="1" height="10">
<div align="center"><img height="25px" src="https://svgsilh.com/svg/2461548.svg"/></div>
<img src="https://img.spacergif.org/v1/spacer.gif" width="1" height="10">
<img src="https://img.spacergif.org/v1/spacer.gif" width="1" height="10">



## Questions around the code

### Why did you build this?
I wanted to play around with the SQLite HttpVFS library. I got carried away with the wikipedia part.

### Why not just build 6 million html files without SQlite?
Static files work well for rendering content. Discoverability demands a separate lookup index and search index. 
You might be able to build those indexes with JSON / your own code; I found SQLite-HttpVFS to be pretty easy to reason about. 

### Are the articles converted to real markdown?
Nope. I extended markdown to support thumbnails and other presentational content that most Markdown formats do not support natively.

### Why is converting from xml to SQLite so slow?
The conversion code is inefficient. For one, it needs to be cleaned up. For two, it could be parallelized.

### Why aren't the SQLite dbs in this repo?
They're [too big](https://docs.github.com/en/github/managing-large-files/working-with-large-files/conditions-for-large-files).
As a workaround, you either generate the databases yourself or get a copy from [Kaggle](https://www.kaggle.com/segfall/markdownlike-wikipedia-dumps-in-sqlite).

<img src="https://img.spacergif.org/v1/spacer.gif" width="1" height="10">
<div align="center"><img height="25px" src="https://svgsilh.com/svg/2461548.svg"/></div>
<img src="https://img.spacergif.org/v1/spacer.gif" width="1" height="10">
<img src="https://img.spacergif.org/v1/spacer.gif" width="1" height="10">


# Credits 

1. [Phiresky](https://github.com/phiresky) for his [sqlite-httpvfs](https://github.com/phiresky/sql.js-httpvfs) library and [tutorial](https://phiresky.github.io/blog/2021/hosting-sqlite-databases-on-github-pages/). 
2. The good christians and folks behind [SQLite](https://www.sqlite.org/index.html).
3. [spencermountain](https://github.com/spencermountain) for his [wtf_wikipedia](https://github.com/spencermountain/wtf_wikipedia) library.
4. Wikipedia for their daily dataset dumps.
5. Everyone in package.json for their libraries.
6. [Me](https://www.linkedin.com/in/timothychambers/) for gluing things together.


<img src="https://img.spacergif.org/v1/spacer.gif" width="1" height="10">
<img src="https://img.spacergif.org/v1/spacer.gif" width="1" height="10">
