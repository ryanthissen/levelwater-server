const knex = require('../../knex');

const postStorageReservoirs = (req, res) => {
  const { water_systems_id, reservoir_type, reservoir_name, year_constructed, capacity, condition } = req.body
  const reservoir = { water_systems_id, reservoir_type, reservoir_name, year_constructed, capacity, condition };

  const currentdate = new Date();
  if (typeof water_systems_id !== 'number') {
    return res.status(400).send('water systems id must not be blank');
  }
  if (!reservoir_name || !reservoir_name.trim()) {
    return res.status(400).send('reservoir name name must not be blank');
  }
  if (!reservoir_type ) {
    return res.status(400).send('reservoir type must not be blank');
  }
  if (!year_constructed || (year_constructed > currentdate.getFullYear())) {
    return res.status(400).send('year constructed must not be blank and must be a valid year');
  }
  if (!capacity) {
    return res.status(400).send('capacity must not be blank');
  }
  if (condition !== 'great' && condition !== 'fair' && condition !== 'poor') {
    return res.status(400).send('condition must not be blank and must be great, fair, or poor');
  }
  knex('users')
  .where('id', req.claim.userId)
  .select('water_systems_id')
  .then((result) => {
    if (Number(reservoir.water_systems_id) !== result[0].water_systems_id) {
      return res.send({ status: 400, ErrorMessage: 'water system not found!' });
    }
    return knex('storage_reservoirs')
    .insert(reservoir)
  })
  .then((result) => {
    reservoir.id = result[0];
    res.status(200).json(reservoir);
  })
  .catch((err) => {
    return res.send({ status: 400, ErrorMessage: err });
  });
};

module.exports = postStorageReservoirs;
