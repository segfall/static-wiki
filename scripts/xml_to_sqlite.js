const Saxophone = require('saxophone');
const toMarkdown = require('./wikitext_to_markdown.js');
const insert  = require('./insert_into_db.js');
const initialize = require('./initialize_db.js');
const optimize = require('./optimize_db.js');

const parser = new Saxophone();
const time = Date.now();

let pageCount = 0;
let lastPage;
let lastTag;
let pages = [];
let db;

parser.on('tagopen', tag => {
    if (tag.name === "page") {
        lastPage = {};
    } else if (tag.name === "title") {
        lastTag = tag.name;
    } else if (tag.name === "text") {
        lastTag = tag.name;
    }
});

parser.on('text', value => {
    let text = value.contents.trim();
    if (text && lastTag) {
        if (lastTag === "text") {
            lastPage.text = text;
            const title = lastPage.title;
            if (title && !title.includes("Special:") && !title.includes("Template:") && !title.includes("Wikipedia:") && !title.includes("Portal:")) {
                let article = toMarkdown({ page: lastPage });
                if (article) {
                    pages.push(article);
                }
            }
            pageCount++;
            if (pageCount % 1000 === 0) {
                console.log(pageCount, (Date.now() - time) / 1000 + "s");
            }
        } else if (lastTag === "title") {
            lastPage.title = text;
        }
    }
    if (pages.length > 1000) {
        insert({ articles: pages, db });
        pages = [];
    }
    lastTag = null;
});

// Called when we are done parsing the document
parser.on('finish', () => {
    console.log('Parsing finished.');
    console.log('Page Count ' + pageCount);
    optimize(db);
});

let name = process.argv[2];
if (!name) {
    throw "Please provide a name for the db file you wish to generate";
}
db = initialize(name);
process.stdin.setEncoding('utf8');
process.stdin.pipe(parser);
