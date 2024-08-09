const axios = require('axios');

const items = [];

const fetchData = async (anchor) => {
    const url = `https://api.nike.com/cic/browse/v2?queryid=products&anonymousId=65B4FB88C8DF99D35180BD753FCAC6BB&country=ca&endpoint=%2Fproduct_feed%2Frollup_threads%2Fv2%3Ffilter%3Dmarketplace(CA)%26filter%3Dlanguage(en-GB)%26filter%3DemployeePrice(true)%26filter%3DattributeIds(16633190-45e5-4830-a068-232ac7aea82c%2C0f64ecc7-d624-4e91-b171-b83a03dd8550)%26anchor%3D24%26consumerChannelId%3Dd9a5bc42-4b9c-4976-858a-f159cf99c647%26count%3D24&language=en-GB&localizedRangeStr=%7BlowestPrice%7D%E2%80%94%7BhighestPrice%7D`;

    try {
        const response = await axios.get(url);
        const products = response.data.data.products.products;

        products.forEach(product => {
            product.colorways.forEach(colorway => {
                items.push({
                    title: product.title + product.subtitle,
                    currentPrice: '$' + colorway.price.currentPrice +'.00',
                    portraitURL: colorway.images.portraitURL,
                    pdpUrl: `https://www.nike.com/${colorway.pdpUrl.replace('{countryLang}', 'ca')}` // Replace placeholder
                });
            });
        });

    } catch (error) {
        console.error(`There was an error fetching the data: ${error}`);
    }
};

const fetchAllData = async () => {
    console.log(items);
};

fetchAllData(); 