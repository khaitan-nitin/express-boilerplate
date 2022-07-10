const express = require('express');

const countryRoutes = require('../module/country/country.route');

const router = express.Router();

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

// mount country routes at /country
router.use('/country', countryRoutes);

module.exports = router;
