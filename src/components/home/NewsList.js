import { useState } from 'react';
import Loading from '../Loading';
import News from './News';

export default function NewsList({ searchResult }) {
    const [author, setAuthor] = useState('');

    const handleAuthorChange = (event) => {
        setAuthor(event.target.value);
    };

    let content;

    if (searchResult.isLoading) {
        content = <Loading />;
    } else if (searchResult.isError) {
        content = <div>Error At Search</div>;
    } else if (searchResult.data?.search) {
        const filteredArticles = searchResult.data.articles.filter((article) => {
            let authorFullName = '';

            if (article?.author) {
                authorFullName = article?.author.toLocaleLowerCase();
            } else if (article?.tags) {
                authorFullName = article.tags
                    .map((tag) => `${tag.firstName} ${tag.lastName}`)
                    .join(',')
                    .toLocaleLowerCase();
            }

            return authorFullName.indexOf(author) > -1;
        });

        const renderedNews = filteredArticles.map((news, index) => {
            return <News key={index} news={news} />;
        });

        content =
            searchResult.data?.articles?.length > 0 ? (
                <div className="mt-2">
                    <div className="px-2">
                        <input
                            type="text"
                            id="author"
                            placeholder="Author"
                            className="w-full max-w-[40rem] max-sm:max-w-none border-2 px-1"
                            value={author}
                            onChange={handleAuthorChange}
                        />
                    </div>
                    <div className="mt-6">
                        <div className="mt-5 flex flex-wrap news-list">{renderedNews}</div>
                    </div>
                </div>
            ) : (
                <div>No Data</div>
            );
    } else {
        content = <div>{searchResult?.data?.error}</div>;
    }

    return content;
}
