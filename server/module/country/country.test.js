const mongoose = require('mongoose');
const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const expect = chai.expect;
const app = require('../../index');

chai.config.includeStack = true;

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});

describe('## Country APIs', () => {
  let country = {
    name: 'Australia',
    shortName: 'AU'
  };

  describe('# POST /api/country', () => {
    it('should create a new country', (done) => {
      request(app)
        .post('/api/country')
        .send(country)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal(country.name);
          expect(res.body.shortName).to.equal(country.shortName);
          country = res.body;
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/country/:countryId', () => {
    it('should get country details', (done) => {
      request(app)
        .get(`/api/country/${country._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal(country.name);
          expect(res.body.shortName).to.equal(country.shortName);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when country does not exists', (done) => {
      request(app)
        .get('/api/country/56c787ccc67fc16ccc1a5e92')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found');
          done();
        })
        .catch(done);
    });
  });

  describe('# PUT /api/country/:countryId', () => {
    it('should update country details', (done) => {
      country.name = 'Australia';
      request(app)
        .put(`/api/country/${country._id}`)
        .send(country)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal('Australia');
          expect(res.body.shortName).to.equal(country.shortName);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/country/', () => {
    it('should get all country', (done) => {
      request(app)
        .get('/api/country')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });

    it('should get all country (with limit and skip)', (done) => {
      request(app)
        .get('/api/country')
        .query({ limit: 10, skip: 1 })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /api/country/', () => {
    it('should delete country', (done) => {
      request(app)
        .delete(`/api/country/${country._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal('Australia');
          expect(res.body.shortName).to.equal(country.shortName);
          done();
        })
        .catch(done);
    });
  });
});
