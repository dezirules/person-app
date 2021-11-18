const {isArray} = require('lodash');

module.exports = (db) => {
  const {Person, Junction} = db.models;

  return {
    create: async (req, res) => {
      try {
        const person = req.body;
        const {cars} = person;
        delete person.cars;

        await db.transaction(async (t) => {
          // create person
          const {id_person} = await Person.create(person, {
            transaction: t,
          });

          if (isArray(cars)) {
            const personCar = cars.map((id_car) => ({
              id_person,
              id_car,
            }));

            // add cars to person
            await Junction.bulkCreate(personCar, {
              ignoreDuplicates: true,
              transaction: t,
            });
          }
        });

        res.json({success: true});
      } catch (error) {
        if (
          error.name === 'SequelizeUniqueConstraintError' &&
          error.fields.cnp
        ) {
          return res.status(400).json({
            errors: {cnp: 'CNP existent'},
          });
        }

        res.status(500).json();
      }
    },

    update: async (req, res) => {
      try {
        const person = req.body;
        const id_person = req.params.id;
        const {cars} = person;
        delete person.cars;

        await db.transaction(async (t) => {
          // update person
          await Person.update(person, {
            where: {id_person},
            transaction: t,
          });

          if (isArray(cars)) {
            // delete existing cars
            await Junction.destroy({where: {id_person}, transaction: t});

            const personCar = cars.map((id_car) => ({
              id_person,
              id_car,
            }));

            // add cars to person
            await Junction.bulkCreate(personCar, {
              ignoreDuplicates: true,
              transaction: t,
            });
          }
        });

        res.json({success: true});
      } catch (error) {
        if (
          error.name === 'SequelizeUniqueConstraintError' &&
          error.fields.cnp
        ) {
          return res.status(400).json({
            errors: {cnp: 'CNP existent'},
          });
        }

        res.status(500).json();
      }
    },

    findAll: async (req, res) => {
      try {
        const resp = await db.query(
          `
          WITH person_car AS (
            SELECT * FROM "Person"
            LEFT JOIN "Junction" USING(id_person)
            LEFT JOIN "Car" USING(id_car)
          )
          SELECT id_person, first_name, last_name, cnp, age,
            COALESCE(           
              ARRAY_AGG(
                JSONB_BUILD_OBJECT(
                  'id_car', id_car, 'brand', brand, 'model', model, 'year', year, 'cylinder_capacity', cylinder_capacity, 'tax', tax
                )
              ) FILTER (WHERE id_car IS NOT NULL),
              '{}'
            ) AS "cars"
          FROM person_car
          GROUP BY id_person, first_name, last_name, cnp, age;
          `,
          {type: db.QueryTypes.SELECT}
        );

        res.json(resp);
      } catch (error) {
        res.status(500).json();
      }
    },

    find: async (req, res) => {
      try {
        const id_person = req.params.id;

        const resp = await db.query(
          `
          WITH person_car AS (
            SELECT * FROM "Person"
            LEFT JOIN "Junction" USING(id_person)
            LEFT JOIN "Car" USING(id_car)
          )
          SELECT id_person, first_name, last_name, cnp, age,
            COALESCE(           
              ARRAY_AGG(
                JSONB_BUILD_OBJECT(
                  'id_car', id_car, 'brand', brand, 'model', model, 'year', year, 'cylinder_capacity', cylinder_capacity, 'tax', tax
                )
              ) FILTER (WHERE id_car IS NOT NULL),
              '{}'
            ) AS "cars"
          FROM person_car
          WHERE id_person = $id_person
          GROUP BY id_person, first_name, last_name, cnp, age;
          `,
          {
            bind: {id_person},
            type: db.QueryTypes.SELECT,
          }
        );

        res.json(resp[0]);
      } catch (error) {
        res.status(500).json();
      }
    },

    destroy: async (req, res) => {
      try {
        const id_person = req.params.id;

        await Person.destroy({where: {id_person}});

        res.json({success: true});
      } catch (error) {
        res.status(400).json();
      }
    },
  };
};
