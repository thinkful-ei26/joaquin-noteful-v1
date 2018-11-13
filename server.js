'use strict';

const { PORT } = require('./config');
const express = require('express');
const data = require('./db/notes');
const simDB = require('./db/simDB'); // <<== add this
const notes = simDB.initialize(data); // <<== and this
const app = express();
const { requestLogger } = require('./middleware/logger');

// ADD STATIC SERVER HERE
app.use(requestLogger);
app.use(express.static('public')); //if you find a request for a static asset, access this directory public

app.get('/api/notes', (req, res, next) => {
  const { searchTerm } = req.query;
  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err);
    }
    res.json(list);
  });
});
app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  let note = data.find(item => item.id === Number(id));
  // console.log(req.params);
  res.json(note);
});

// app.get('/boom', (req, res, next) => {
//   throw new Error('Boom!!');
// });

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
