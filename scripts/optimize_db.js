module.exports = function(db) {

    console.log("Clearing temp tables")
    db.prepare(`drop table wiki_redirect_temp`).run()

    console.log("Temp table cleared")

    console.log("Optimizing article search")
    db.prepare(`insert into wiki_article_search(wiki_article_search, rank) values ('rank', 'bm25(1, 10)')`).run()
    db.prepare(`insert into wiki_article_search(wiki_article_search) values ('optimize')`).run()
    console.log("Article search optimized")

    console.log("Optimizing wiki title search")
    db.prepare(`insert into wiki_title_search(wiki_title_search, rank) values ('rank', 'bm25(1)')`).run()
    db.prepare(`insert into wiki_title_search(wiki_title_search) values ('optimize')`).run()
    console.log("Wiki title search optimized")

    console.log("Vacuuming");
    db.prepare(`vacuum`).run()
    console.log("Vacuumed");

    console.log("Analyzing");
    db.prepare(`analyze`).run()
    console.log("Analyzed");

}