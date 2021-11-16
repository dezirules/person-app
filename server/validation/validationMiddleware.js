module.exports =
  (...fieldsToBeValidated) =>
  (req, res, next) => {
    const validateField = require('./validateField');

    let errors = {};

    for (let field of fieldsToBeValidated) {
      const validationError = validateField(field, req.body[field]);

      errors = {...errors, ...validationError};
    }

    if (Object.keys(errors).length === 0) return next();

    res.status(400).json({
      errors,
    });
  };
