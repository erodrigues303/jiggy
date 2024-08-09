const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Configuration
const totalPages = 6;
const dbPath = path.join(__dirname, '..', 'database', 'jiggy.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the jiggy database.');
    }
});

// Function to insert data into the database
const insertData = (name, price, image_url, link, category, store) => {
    const sql = `INSERT INTO clothes (name, price, image_url, link, category, store, styles) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [name, price, image_url, link, category, store, ''], function(err) {
        if (err) {
            return console.error('Error inserting data:', err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
};

// Function to remove duplicate entries based on name
const removeDuplicates = () => {
    const sql = `
        DELETE FROM clothes
        WHERE id NOT IN (
            SELECT MIN(id)
            FROM clothes
            GROUP BY name
        )
    `;
    db.run(sql, function(err) {
        if (err) {
            return console.error('Error removing duplicates:', err.message);
        }
        console.log(`Removed ${this.changes} duplicate rows.`);
    });
};

// Function to fetch data from Nike API
const fetchData = async (anchor) => {
    const url = `https://api.nike.com/cic/browse/v2?queryid=products&anonymousId=65B4FB88C8DF99D35180BD753FCAC6BB&country=ca&endpoint=%2Fproduct_feed%2Frollup_threads%2Fv2%3Ffilter%3Dmarketplace(CA)%26filter%3Dlanguage(en-GB)%26filter%3DemployeePrice(true)%26filter%3DattributeIds(de314d73-b9c5-4b15-93dd-0bef5257d3b4%2C0f64ecc7-d624-4e91-b171-b83a03dd8550)%26anchor%3D${anchor}%26consumerChannelId%3Dd9a5bc42-4b9c-4976-858a-f159cf99c647%26count%3D24&language=en-GB&localizedRangeStr=%7BlowestPrice%7D%E2%80%94%7BhighestPrice%7D`;

    try {
        const response = await axios.get(url);
        const products = response.data.data.products.products;

        products.forEach(product => {
            product.colorways.forEach(colorway => {
                insertData(
                    product.title + ' ' + product.subtitle,
                    '$' + colorway.price.currentPrice + '.00',
                    colorway.images.portraitURL,
                    `https://www.nike.com/${colorway.pdpUrl.replace('{countryLang}', 'ca')}`, // Replace placeholder
                    'Shirt',
                    'Nike'
                );
            });
        });

    } catch (error) {
        console.error(`There was an error fetching the data: ${error}`);
    }
};

// Function to fetch all data
const fetchAllData = async () => {
    for (let anchor = 0; anchor < totalPages * 24; anchor += 24) {
        await fetchData(anchor);
    }
};

// Fetch data and remove duplicates
fetchAllData().then(() => {
    removeDuplicates();
});

// Close the database connection when the Node process ends
process.on('exit', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Closed the database connection.');
        }
    });
});