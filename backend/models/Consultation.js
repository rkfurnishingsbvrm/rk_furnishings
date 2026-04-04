const mongoose = require('mongoose');

const ConsultationSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    serviceType: { type: String, required: true },
    preferredDate: { type: Date, required: true },
    message: { type: String },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Consultation', ConsultationSchema);
