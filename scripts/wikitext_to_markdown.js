const wtf = require('wtf_wikipedia')
const decode = require('unescape');
wtf.extend(require('wtf-plugin-markdown'))
wtf.extend(require('wtf-plugin-html'))

var replacements = [
    [/\*/g, '\\*', 'asterisks'],
    [/#/g, '\\#', 'number signs'],
    [/\//g, '\\/', 'slashes'],
    [/\(/g, '\\(', 'parentheses'],
    [/\)/g, '\\)', 'parentheses'],
    [/\[/g, '\\[', 'square brackets'],
    [/\]/g, '\\]', 'square brackets'],
    [/</g, '&lt;', 'angle brackets'],
    [/>/g, '&gt;', 'angle brackets'],
    [/_/g, '\\_', 'underscores']
]

var escape = function (string, skips) {
    skips = skips || []
    return replacements.reduce(function (string, replacement) {
        var name = replacement[2]
        return name && skips.indexOf(name) !== -1
            ? string
            : string.replace(replacement[0], replacement[1])
    }, string)
}


function formatLastLine(text) {
    let lines = text.trim().split("\n");
    let lastLine = lines.slice(-1)[0];
    if (lastLine.indexOf("#") === 0) {
        lines.pop()
    }
    return lines.join("\n");
}

const getImageMarkdown = function (image, rep="") {
    let alt = image.data.file.replace(/^(file|image):/i, '')
    alt = alt.replace(/\.(jpg|jpeg|png|gif|svg)/i, '')
    return '![' + alt + rep + '](' + image.thumbnail() + ')';
}

const getCaption = function (image) {
    if (!image.data.wiki) {
        return "";
    }
    let split;
    if (image.data.wiki.includes(" | ")) {
        split = image.data.wiki.split(" | ")
    } else {
        split = image.data.wiki.split("|");
    }
    return image.data.wiki && escape(wtf(split.slice(-1)[0]).markdown().replace(/]]/g, ""));
}


function processImages(text, images) {
    const json =  images[0] &&  images[0].json();
    if (json && !text.includes(json.url)) {
        text = `<img src="${json.url}" id="info-image" /> \n\n` + text;
    }
    for (let image of images) {
        if (image === images[0]) {
            continue;
        }
        text = text.replace(getImageMarkdown(image), getImageMarkdown(image,
            "|||" + (
                image.data.wiki ?
                    getCaption(image) :
                    image.caption()
            )
        ))
    }
    return text;
}

function wikify(page) {
    let { text } = page;
    text = decode(text);
    try {
        const w = wtf(text);
        page.plainText = w.text();
        text = (w.markdown() || "").trim();
        // need to clean up the table merging with the first paragraph
        if (text[0] === '|') {
            const lines = text.split("\n");
            let i = 0;
            let line = lines[i].trim();
            while (line[0] === "|" || !line[0] || line[0].match(/\s/)) {
                ++i;
                if (i >= lines.length) {
                    break;
                }
                line = lines[i].trim();
            }
            if (i < lines.length) {
                lines[i] = "\n" + lines[i];
                text = lines.join("\n");
            }
        }
        text = processImages(text, w.images());

    } catch (err) {
        console.error(page.title, "errored", err);
    }
    for (let n = 0; n < 10; n++) {
        text = text.replace(/^#+.*\n\n\n#/gm, "#");
    }
    page.text = formatLastLine(text).trim();
    if (page.text.indexOf("↳ [undefined]") === 0) {
        page.title_redirect = page.redirect = page.text.replace(/↳ \[undefined]\[(.*)].*/g, '$1');
        page.text = "";
        return;
    }
    page.redirect = null;
    return page;
}

module.exports = function ({ page }) {
    if (page.text.includes("#REDIRECT")) {
        try {
            page.redirect = page.text.split("[[")[1].split("]]")[0];
            page.text = ""
            return page;
        } catch (err) {
            console.error("Redirect error", err)
        }
    } else {
        return wikify(page)
    }
}