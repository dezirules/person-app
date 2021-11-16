module.exports = (app) => {
  'use strict';
  const express = require('express');
  const carCtrl = require('../controllers/carCtrl')(app.locals.db);
  const router = express.Router();
  const validateFields = require('../validation/validationMiddleware');

  router.post(
    '/',
    validateFields('brand', 'model', 'year', 'cylinder_capacity', 'tax'),
    carCtrl.create
  );
  router.put(
    '/:id',
    validateFields('brand', 'model', 'year', 'cylinder_capacity', 'tax'),
    carCtrl.update
  );
  router.get('/', carCtrl.findAll);
  router.get('/:id', carCtrl.find);
  router.delete('/:id', carCtrl.destroy);

  return router;
};
