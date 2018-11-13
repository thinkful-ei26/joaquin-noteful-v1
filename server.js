'use strict';

const { PORT } = require('./config');
const express = require('express');
const data = require('./db/notes');

const app = express();

// ADD STATIC SERVER HERE

app.get('/api/notes/searchTerm', (req, res) => {
  const { searchTerm } = req.query;
  res.json(
    searchTerm ? data.filter(item => item.title.includes(searchTerm)) : data
  );
});

app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  let note = data.find(item => item.id === Number(id));
  // console.log(req.params);
  res.json(note);
});

// const { searchTerm } = req.query;
// res.json(searchTerm ? data.filter(item => item.title.includes(searchTerm)) : data);

app
  .listen(PORT, function() {
    console.info(`Server listening on ${this.address().port}`);
  })
  .on('error', err => {
    console.error(err);
  });
