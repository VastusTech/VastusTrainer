function addToFeed(date, image, meta, summary, extratext) {
    return {
        date: date,
        image: image,
        meta: meta,
        summary: summary,
        extratext: extratext,
    };
}

export default addToFeed;