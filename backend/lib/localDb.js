const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '../data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const BLOG_FILE = path.join(DATA_DIR, 'blog.json');
const CONSULTATIONS_FILE = path.join(DATA_DIR, 'consultations.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial data if file doesn't exist
const INITIAL_PRODUCTS = [];

const readData = (filePath, initialData) => {
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
            return initialData;
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return initialData;
    }
};

const writeData = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error);
    }
};

module.exports = {
    getProducts: () => readData(PRODUCTS_FILE, INITIAL_PRODUCTS),
    saveProducts: (products) => writeData(PRODUCTS_FILE, products),
    getBlogPosts: () => readData(BLOG_FILE, []),
    saveBlogPosts: (posts) => writeData(BLOG_FILE, posts),
    getConsultations: () => readData(CONSULTATIONS_FILE, []),
    saveConsultations: (consultations) => writeData(CONSULTATIONS_FILE, consultations),
    getSettings: () => readData(SETTINGS_FILE, { adminPassword: 'rkadmin123', contactNumber: '+91 1234567890', supportEmail: 'contact@rkfurnishings.in' }),
    saveSettings: (settings) => writeData(SETTINGS_FILE, settings),
};
