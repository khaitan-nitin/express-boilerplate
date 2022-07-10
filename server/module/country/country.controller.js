const httpStatus = require('http-status');
const countryService = require('./country.service');

const pick = require('../../util/pick');
const catchAsync = require('../../util/catchAsync');
const ApiError = require('../../util/ApiError');

const findById = catchAsync(async (req, res) => {
  const country = await countryService.findById(req.params.countryId);
  if (!country) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Country not found');
  }
  res.send(country);
});

const findAll = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'shortName']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await countryService.findAll(filter, options);
  res.send(result);
});

const create = catchAsync(async (req, res) => {
  const country = await countryService.create(req.body);
  res.status(httpStatus.CREATED).send(country);
});

const update = catchAsync(async (req, res) => {
  const country = await countryService.update(req.params.countryId, req.body);
  res.send(country);
});

const del = catchAsync(async (req, res) => {
  await countryService.del(req.params.countryId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  findById,
  findAll,
  create,
  update,
  del
};
