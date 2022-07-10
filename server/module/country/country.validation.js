const Joi = require('joi');

// POST /api/country
const createCountry = {
  body: Joi.object({
    name: Joi.string().required(),
    shortName: Joi.string().max(4).required()
  })
};

// UPDATE /api/country/:countryId
const updateCountry = {
  body: Joi.object({
    name: Joi.string().required(),
    shortName: Joi.string().max(4).required()
  }),
  params: Joi.object({
    countryId: Joi.string().hex().required()
  })
};

// GET /api/country
const findCountries = {
  query: Joi.object().keys({
    name: Joi.string(),
    shortName: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createCountry,
  updateCountry,
  findCountries
};
