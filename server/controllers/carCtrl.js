module.exports = (db) => {
  const {Car} = db.models;

  return {
    create: async (req, res) => {
      try {
        await Car.create(req.body);

        res.json({success: true});
      } catch (error) {
        res.status(500).json();
      }
    },

    update: async (req, res) => {
      try {
        const id_car = req.params.id;

        await Car.update(req.body, {where: {id_car}});

        res.json({success: true});
      } catch (error) {
        res.status(500).json();
      }
    },

    findAll: async (req, res) => {
      try {
        const resp = await Car.findAll({
          attributes: [
            'id_car',
            'brand',
            'model',
            'year',
            'cylinder_capacity',
            'tax',
          ],
        });

        res.json(resp);
      } catch (error) {
        res.status(500).json();
      }
    },

    find: async (req, res) => {
      try {
        const id_car = req.params.id;

        const resp = await Car.findOne({
          where: {id_car},
          attributes: [
            'id_car',
            'brand',
            'model',
            'year',
            'cylinder_capacity',
            'tax',
          ],
        });

        res.json(resp);
      } catch (error) {
        res.status(500).json();
      }
    },

    destroy: async (req, res) => {
      try {
        const id_car = req.params.id;

        await Car.destroy({where: {id_car}});

        res.json({success: true});
      } catch (error) {
        res.status(500).json();
      }
    },
  };
};
