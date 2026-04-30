const express = require('express');
const router = express.Router();
const localDb = require('../lib/localDb');

// POST Create Order
router.post('/', async (req, res) => {
    try {
        const { items, shippingAddress, totalAmount, userId } = req.body;
        
        if (!items || !shippingAddress || !totalAmount) {
            return res.status(400).json({ message: 'Items, address, and total amount are required' });
        }

        const orders = localDb.getOrders();
        const newOrder = {
            id: `ORD-${Date.now()}`,
            items,
            shippingAddress,
            totalAmount,
            userId: userId || 'guest',
            status: 'pending',
            paymentStatus: 'unpaid',
            created_at: new Date().toISOString()
        };

        orders.push(newOrder);
        localDb.saveOrders(orders);

        res.status(201).json({ 
            message: 'Order placed successfully', 
            orderId: newOrder.id,
            total: totalAmount 
        });
    } catch (error) {
        res.status(500).json({ message: 'Order processing failed', error: error.message });
    }
});

// GET Orders (for admin)
router.get('/', async (req, res) => {
    try {
        const orders = localDb.getOrders();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

module.exports = router;
