const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');
const localDb = require('../lib/localDb');

// POST book a consultation
router.post('/book', async (req, res) => {
    try {
        const { userName, phone, email, serviceType, productInterest, preferredDate, message } = req.body;

        if (!userName || !phone || !email || !serviceType || !preferredDate) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }

        let booking;
        try {
            const { data, error } = await supabase
                .from('consultations')
                .insert([{
                    user_name: userName, phone, email,
                    service_type: serviceType,
                    product_interest: productInterest || null,
                    preferred_date: preferredDate,
                    message: message || null,
                }])
                .select()
                .single();
            if (error) throw error;
            booking = data;
        } catch (dbErr) {
            console.log('🔄 Supabase unreachable, using local fallback for booking. Error:', dbErr.message);
            const consultations = localDb.getConsultations();
            booking = {
                id: `consult-${Date.now()}`,
                user_name: userName, phone, email,
                service_type: serviceType,
                product_interest: productInterest || null,
                preferred_date: preferredDate,
                message: message || null,
                status: 'pending',
                created_at: new Date().toISOString()
            };
            consultations.push(booking);
            localDb.saveConsultations(consultations);
            console.log('✅ Booking saved locally:', booking.id);
        }

        if (!booking) throw new Error('Failed to create booking in both cloud and local storage');
        res.status(201).json({ message: 'Consultation booked successfully', booking });
    } catch (error) {
        console.error('❌ Final booking error:', error);
        res.status(500).json({ message: 'Error booking consultation', error: error.message });
    }

});

// GET all consultations (admin)
router.get('/', async (req, res) => {
    try {
        let data, error;
        try {
            const result = await supabase
                .from('consultations')
                .select('*')
                .order('created_at', { ascending: false });
            data = result.data;
            error = result.error;
            if (error) throw error;
            if (!data || data.length === 0) throw new Error('No cloud data');
        } catch (dbErr) {
            data = localDb.getConsultations();
            data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching consultations', error: error.message });
    }
});

// PATCH update consultation status (admin)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        let updated;
        try {
            const { data, error } = await supabase
                .from('consultations')
                .update({ status })
                .eq('id', req.params.id)
                .select()
                .single();
            if (error) throw error;
            updated = data;
        } catch (dbErr) {
            const consultations = localDb.getConsultations();
            const index = consultations.findIndex(c => c.id === req.params.id);
            if (index === -1) return res.status(404).json({ message: 'Consultation not found' });
            consultations[index].status = status;
            localDb.saveConsultations(consultations);
            updated = consultations[index];
        }
        res.status(200).json({ message: 'Status updated', consultation: updated });
    } catch (error) {
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
});

module.exports = router;

