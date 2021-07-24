const yargs = require('yargs/yargs')
const argv = yargs(process.argv.slice(2)).argv

module.exports = function ({ articles, db }) {
    const updateArticles = db.prepare(`update wiki_articles SET title=@title, text=@text WHERE title=@title`)
    const mainArticles = db.prepare(`insert or ignore into wiki_articles (title, text, redirect) VALUES (@title, @text, @redirect)`)
    const titleSearch = db.prepare(`insert or ignore into wiki_title_search(search_title, title, redirect) VALUES (@search_title, @title, @redirect)`)
    const dupRedirect = db.prepare(`insert into wiki_redirect_temp(redirect) VALUES (@redirect)`)
    const searchArticles = db.prepare(`insert into wiki_article_search(title, text) VALUES (@title, @text)`)
    db.transaction(() => {
        for (const article of articles) {
            let hasHashInRedirect = article.redirect && article.redirect.includes("#");
            // Add the article's title to the autocomplete search if it either has text or if there's a hash in the redirect
            if (article.text || hasHashInRedirect) {
                try {
                    // There are many redirects that could show up in the autocomplete
                    // To reduce spam, only first one is recorded for search
                    if (hasHashInRedirect) {
                        dupRedirect.run({
                            ...article
                        })
                    }
                    titleSearch.run({
                        ...article,
                        search_title: article.title.replace(/'/g, '').replace(/\s/g, '').replace(/"/g, '').replace(/:/g, '').replace(/\(/g, '').replace(/\)/g, ''),
                    });
                } catch (e) {
                    // if the title can't be added to the autocomplete search, just skip it.
                }
            }
            if (article.text) {
                updateArticles.run(article);
                if (argv['article-search-index'] && article.plainText) {
                    searchArticles.run({
                        title: article.title,
                        text: article.plainText
                    })
                }
            }
            mainArticles.run(article);
        }
    })()
}