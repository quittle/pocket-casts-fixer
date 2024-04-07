const fs = require('node:fs');

exports.handler = async (event) => {
    const rssUrl = event.queryStringParameters?.rssUrl;
    if (!rssUrl) {
        console.debug("Returning html");
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "text/html",
            },
            body: fs.readFileSync('index.html', 'utf8')
        }
    }

    const result = await fetch(rssUrl);
    if (!result.ok) {
        console.debug(`Encountered error: ${result.status}`);
        return {
            statusCode: result.status,
            body: await result.blob(),
        }
    }
    const text = await result.text();

    const cleanedText = text.replaceAll(String.raw`<!--<pubDate>file element=rss.pubDate</pubDate>-->`, "<pubDate>2000-01-01T01:00:00Z</pubDate>");

    console.debug("Returning RSS");
    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
        },
        body: cleanedText,
    };
};