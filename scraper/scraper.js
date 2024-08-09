const PORT = 8000;
const axios = require('axios');
const express = require('express');
const cheerio = require('cheerio');

const app = express();

const url = 'https://www.hugoboss.com/ca/en/men-polo-shirts/?start=30&sz=30';

axios.get(url, {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.google.com'
    }
})
.then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
    const items = [];

    $('div.product-tile').each(function() {
        const nameElement = $(this).find('a.product-tile-plp__title-link');
        const title = nameElement.attr('title').trim();
        const link = nameElement.attr('href');
        const imageURL = $(this).find('img.product-tile__container-image').attr('src') || 'No image URL';
        const price = $(this).find('div.pricing__main-price').text().trim();

        items.push({
            title,
            link,
            imageURL,
            price
        });
    });

    console.log(items);
})
.catch(error => {
    console.error(`There was an error fetching the data: ${error}`);
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));