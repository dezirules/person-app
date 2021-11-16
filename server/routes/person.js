module.exports = (app) => {
  'use strict';
  const express = require('express');
  const personCtrl = require('../controllers/personCtrl')(app.locals.db);
  const router = express.Router();
  const validateFields = require('../validation/validationMiddleware');

  router.post(
    '/',
    validateFields('first_name', 'last_name', 'cnp', 'age'),
    personCtrl.create
  );
  router.put(
    '/:id',
    validateFields('first_name', 'last_name', 'cnp', 'age'),
    personCtrl.update
  );
  router.get('/', personCtrl.findAll);
  router.get('/:id', personCtrl.find);
  router.delete('/:id', personCtrl.destroy);

  return router;
};
