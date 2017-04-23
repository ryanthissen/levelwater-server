exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('sources').del()
    .then(() => {
      return knex('sources').insert([{
        id: 1,
        water_systems_id: 1,
        source_name: 'bubbly springs',
        system_source_id: 5,
        source_type: 'gw',
        critical_to_operations: 'true',
        treatment: true,
        year_constructed: 1999,
        capacity: 1111,
        condition: 'great',
        estimated_replacement_cost: 33,
        estimated_time_to_replacement: 45,
        rate_increase_sentence: 'Yo you\'re rates suck bro',
        continuos_clorination: 'false'
      }]);
    });
};
