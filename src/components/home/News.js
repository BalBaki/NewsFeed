export default function News({ news }) {
    const url = news.url || news.webUrl;
    const imageUrl = news.urlToImage || news.fields?.thumbnail;
    const title = news.title || news.webTitle;
    const description = news.description || news.fields?.bodyText;

    return (
        <div className="border-2 mb-2 text-justify news-item">
            <a href={url} target="_blank" rel="noreferrer">
                <div className="flex items-center h-48">
                    <img src={imageUrl} alt={title} className="w-full h-full" loading="lazy" />
                </div>
                <div className="border-b-3 text-md">
                    <div className="line-clamp-2 font-bold " title={title}>
                        {title}
                    </div>
                    <div className="line-clamp-3" title={description}>
                        {description}
                    </div>
                </div>
            </a>
        </div>
    );
}
