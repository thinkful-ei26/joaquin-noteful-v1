'use strict';

const { PORT } = require('./config');
const express = require('express');

const app = express();
const morgan = require('morgan');

const notesRouter = require('./router/notes.router.js');
// const { requestLogger } = require('./middleware/logger');
app.use(express.json());

// ADD STATIC SERVER HERE
app.use(morgan('common'));
app.use(express.static('public')); //if you find a request for a static asset, access this directory public
app.use('/api/notes', notesRouter );


app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

app
  .listen(PORT, function() {
    console.info(`Server listening on ${this.address().port}`);
  })
  .on('error', err => {
    console.error(err);
  });

