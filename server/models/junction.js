module.exports = (sequelize) => {
  const {Person, Car} = sequelize.models;

  Person.belongsToMany(Car, {
    through: 'Junction',
    foreignKey: 'id_person',
  });

  Car.belongsToMany(Person, {
    through: 'Junction',
    foreignKey: 'id_car',
  });

  return sequelize.models.Junction;
};
