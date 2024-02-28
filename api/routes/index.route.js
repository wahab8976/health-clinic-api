const express = require('express');
const router = express.Router();

// Import your route handlers
const adminRoutes = require('./admin.route');
const doctorRoutes = require('./doctor.route');
const patientRoutes = require('./patient.route');
const appointmentRoutes = require('./appointment.route');

// Mount the route handlers
router.use('/admin', adminRoutes);
router.use('/doctor', doctorRoutes);
router.use('/patient', patientRoutes);
router.use('/appointments', appointmentRoutes);

module.exports = router;
