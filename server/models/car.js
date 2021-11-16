module.exports = (sequelize, DataType) => {
  let model = sequelize.define(
    'Car',
    {
      id_car: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      brand: {
        type: DataType.STRING(255),
        allowNull: false,
      },
      model: {
        type: DataType.STRING(255),
        allowNull: false,
      },
      year: {
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: new Date().getFullYear(),
        },
      },
      cylinder_capacity: {
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 9999,
        },
      },
      tax: {
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 9999,
          taxValidator(tax) {
            if (this.cylinder_capacity < 1500 && tax === 50) return;
            if (this.cylinder_capacity < 2000 && tax === 100) return;
            if (this.cylinder_capacity >= 2000 && tax === 200) return;

            throw new Error('Taxă de impozit invalidă');
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
