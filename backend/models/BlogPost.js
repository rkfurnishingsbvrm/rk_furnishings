const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true, default: 'RK Furnishings Team' },
    content: { type: String, required: true },
    images: [{ type: String }],
    publishDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('BlogPost', BlogPostSchema);
