module.exports = (fieldToBeValidated, value) => {
  const Cnp = require('../utils/cnp');

  const validate = {
    first_name() {
      if (typeof value !== 'string' || value.length === 0)
        return 'Prenumele trebuie introdus';
      if (value.length > 255) return 'Prenume invalid';
    },
    last_name() {
      if (typeof value !== 'string' || value.length === 0)
        return 'Numele trebuie introdus';
      if (value.length > 255) return 'Nume invalid';
    },
    cnp() {
      if (typeof value !== 'string' || value.length === 0)
        return 'CNP-ul trebuie introdus';
      if (!Cnp.validateCnp(value)) return 'CNP invalid';
    },
    age() {
      if (typeof value !== 'number') return 'Vârsta trebue introdusă';
      if (value < 0 || value > 999) return 'Vârstă invalidă';
    },
    brand() {
      if (typeof value !== 'string' || value.length === 0)
        return 'Marca trebuie introdusă';
      if (value.length > 255) return 'Marcă invalidă';
    },
    model() {
      if (typeof value !== 'string' || value.length === 0)
        return 'Modelul trebuie introdus';
      if (value.length > 255) return 'Model invalid';
    },
    year() {
      if (typeof value !== 'number') return 'Anul fabricației trebuie introdus';
      if (value < 0 || value > new Date().getFullYear())
        return 'Anul fabricației invalid';
    },
    cylinder_capacity() {
      if (typeof value !== 'number')
        return 'Capacitatea cilindrică trebuie introdusă';
      if (value < 0 || value > 9999) return 'Capacitate cilindrică invalidă';
    },
    tax() {
      if (typeof value !== 'number') return 'Taxa de impozit trebuie introdusă';
      if (typeof value !== 'number' || value < 0 || value > 9999)
        return 'Taxă de impozit invalidă';
    },
  };

  const errorMessage = validate[fieldToBeValidated]();

  if (errorMessage)
    return {
      [fieldToBeValidated]: errorMessage,
    };

  return {};
};
