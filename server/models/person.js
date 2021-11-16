module.exports = (sequelize, DataType) => {
  const Cnp = require('../utils/cnp');

  let model = sequelize.define(
    'Person',
    {
      id_person: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: {
        type: DataType.STRING(255),
        allowNull: false,
      },
      last_name: {
        type: DataType.STRING(255),
        allowNull: false,
      },
      cnp: {
        type: DataType.STRING(13),
        allowNull: false,
        unique: true,
        validate: {
          cnpValidator(cnp) {
            if (!Cnp.validateCnp(cnp)) throw new Error('CNP invalid');
          },
        },
      },
      age: {
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 999,
          ageValidator(age) {
            const cnp = new Cnp(this.cnp);
            if (cnp.age !== age) throw new Error('Vârstă invalidă');
          },
        },
      },
    },
    {
      timestamps: true,
    }
  );

  return model;
};
