const express = require('express');

const validate = require('../../util/validate');
const requestValidation = require('./country.validation');

const countryCtrl = require('./country.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/country - Get list of countries */
  .get(validate(requestValidation.findCountries), countryCtrl.findAll)

  /** POST /api/country - Create new country */
  .post(validate(requestValidation.createCountry), countryCtrl.create);

router.route('/:countryId')
  /** GET /api/country/:countryId - Get country */
  .get(countryCtrl.findById)

  /** PUT /api/country/:countryId - Update country */
  .put(validate(requestValidation.updateCountry), countryCtrl.update)

  /** DELETE /api/country/:countryId - Delete country */
  .delete(countryCtrl.del);

module.exports = router;
