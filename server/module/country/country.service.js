const httpStatus = require('http-status');
const Country = require('./country.model');
const ApiError = require('../../util/ApiError');

const findById = async (id) => Country.findById(id);

const findAll = async (filter, options) => {
  const countries = await Country.paginate(filter, options);
  return countries;
};

const findCountryByName = async (name) => Country.findOne({ name });

const create = async (countryBody) => {
  if (await Country.isNameTaken(countryBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Country name already taken');
  }
  return Country.create(countryBody);
};

const update = async (countryId, updateBody) => {
  const country = await findById(countryId);

  if (!country) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Country not found');
  }
  if (updateBody.name && (await Country.isNameTaken(updateBody.name, countryId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Country name already taken');
  }
  Object.assign(country, updateBody);

  await country.save();
  return country;
};

const del = async (countryId) => {
  const country = await findById(countryId);
  if (!country) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Country not found');
  }
  await country.remove();
  return country;
};

module.exports = {
  findById,
  findAll,
  findCountryByName,
  create,
  update,
  del
};
