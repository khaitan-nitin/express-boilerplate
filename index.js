const createError = require('http-errors');
const express = require('./server/config/express');
const db = require('./server/config/db');

// catch 404 and forward to error handler
express.use((req, res, next) => {
  next(createError(404));
});

// error handler
express.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = express;
