// Import url to fetch da articles
import { newsUrl } from './newsApi.js';
// Article element class description
import './news-article.js';

window.addEventListener('load', () => {
    getPWANews(); 
});

// Method to retrieve articles from API (async)
async function getPWANews() {
    // GET request to articles url
    const res = await fetch(newsUrl);
    // Result json
    const json = await res.json();

    // Now that we ahve the json response we can add it to the page
    const main = document.querySelector('main');
    json.articles.forEach(article => {
        const el = document.createElement('news-article');
        el.article = article;
        main.appendChild(el);
    });
}
