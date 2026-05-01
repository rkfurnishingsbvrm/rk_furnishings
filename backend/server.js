const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const productRoutes = require('./routes/products');
const consultationRoutes = require('./routes/consultations');
const blogRoutes = require('./routes/blog');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');


app.use('/api/products', productRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);


// Health check
app.get('/', (req, res) => {
    res.json({ 
        status: 'RK Furnishings API is running', 
        database: 'Supabase-Local-Fallback',
        version: '2.0.1-robust',
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
