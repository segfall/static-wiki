const fs = require('fs');

module.exports = function(dbFile) {
    try {
        fs.unlinkSync(dbFile);
    } catch (err) {}

    const db = require('better-sqlite3')(dbFile);

    db.prepare(`pragma journal_mode = delete`).run();
    db.prepare(`pragma page_size = 8192`).run()

    db.prepare(`
        create table wiki_articles (
            title text COLLATE NOCASE PRIMARY KEY,
            text text,
            redirect text
        );
    `).run();

    db.prepare(`
        create table wiki_redirect_temp (
            redirect text PRIMARY KEY
        );
    `).run();

    db.prepare(`
        create virtual table wiki_title_search using fts5(
            search_title, title UNINDEXED, redirect UNINDEXED,
            tokenize="trigram"
        );
    `).run();

    db.prepare(`
        create virtual table wiki_article_search using fts5(
            title, text, tokenize="porter ascii"
        );
    `).run();


    return db;
}