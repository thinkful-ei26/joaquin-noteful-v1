'use strict';

const express = require('express');
const router = express.Router();

const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

router.get('/', (req, res, next) => {
  const { searchTerm } = req.query;
  // notes.filter(searchTerm, (err, list) => {
  //   if (err) {
  //     return next(err);
  //   }
  //   res.json(list);
  // });
  notes
    .filter(searchTerm)
    .then(list => {
      if (list) {
        res.json(list);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  // notes.find(id, (err, item) => {
  //   if (err) {
  //     return next(err);
  //   }
  //   if (id) {
  //     res.json(item);
  //   } else {
  //     return 'not found';
  //   }
  // });
  notes
    .find(id)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

// Post (insert) an item
router.post('/', (req, res, next) => {
  const { title, content } = req.body;
  console.log(req.body);

  const newItem = { title, content };
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  // notes.create(newItem, (err, item) => {
  //   if (err) {
  //     return next(err);
  //   }
  //   if (item) {
  //     res
  //       .location(`http://${req.headers.host}/notes/${item.id}`)
  //       .status(201)
  //       .json(item);
  //   } else {
  //     next();
  //   }
  // });
  notes
    .create(newItem)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  // notes.delete(req.params.id, function() {
  //   console.log('Item deleted');
  //   res.status(204).end();
  // });
  notes
    .delete(id)
    .then(item => {
      if (item) {
        console.log('Item deleted');
      } else {
        next();
      }
    })
    .catch(err => {
      res.status(204).end();
      next(err);
    });
});

router.put('/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  // notes.update(id, updateObj, (err, item) => {
  //   if (err) {
  //     return next(err);
  //   }
  //   if (item) {
  //     res.json(item);
  //   } else {
  //     next();
  //   }
  // });
  notes
    .update(id, updateObj)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
