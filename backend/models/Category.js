const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Category', CategorySchema);
