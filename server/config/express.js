const express = require('express');
const path = require('path');

const cookieParser = require('cookie-parser');

const compress = require('compression');
const methodOverride = require('method-override');

const helmet = require('helmet');
const cors = require('cors');

const logger = require('morgan');
const rfs = require('rotating-file-stream');

const httpStatus = require('http-status');
const expressValidation = require('express-validation');

const expressWinston = require('express-winston');
const winstonInstance = require('./winston');
const config = require('./environment');

const routes = require('./route');

const APIError = require('../util/ApiError');

const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, './../../', 'log')
});

const app = express();

if (config.env === 'dev') {
  app.use(logger('dev'));
} else {
  app.use(logger('combined', { stream: accessLogStream }));
}

// parse body params and attache them to req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());
app.use(helmet.hidePoweredBy());
app.use(helmet.xssFilter());
app.use(helmet.ieNoOpen());
app.use(helmet.frameguard({ action: 'sameorigin' }));
app.use(helmet.dnsPrefetchControl({ allow: true }));
app.use(helmet.originAgentCluster());
app.use(helmet.hsts({ maxAge: 123456, includeSubDomains: false, preload: true }));

// enable CORS - Cross Origin Resource Sharing
const whitelist = ['localhost:4040'];
const corsOptions = function corsOptionsFn(req, callback) {
  if (config.corsEnabled) {
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  } else {
    callback(null, true);
  }
};
app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, './../../', 'public')));

// enable detailed API logging in dev env
if (config.env === 'dev') {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  app.use(expressWinston.logger({
    winstonInstance,
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorStatus: true
  }));
}

// mount all routes on /api path
app.use('/api', routes);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
    const error = new APIError(err.status, unifiedErrorMessage, true);
    return next(error);
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.status, err.message, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError(httpStatus.NOT_FOUND, 'API not found');
  return next(err);
});

// log error in winston transports except when executing test suite
if (config.env !== 'test') {
  app.use(expressWinston.errorLogger({
    winstonInstance
  }));
}

// error handler, send stacktrace only during development
app.use((err, req, res, next) => res.status(err.status).json({
  message: err.isPublic ? err.message : httpStatus[err.status],
  stack: config.env === 'dev' ? err.stack : {}
}));

module.exports = app;
