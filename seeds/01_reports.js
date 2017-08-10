exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('report1').del()
    .then(function () {
      // Inserts seed entries
      return knex('report1').insert([
        {id: 1, total_Provisioned_Vehicles: 100,
        total_Provisioned_TCUs: 500,
        total_Subscribed_Bundles: 6000,
        total_Demo_Bundles: 1000,
        eCall: 10},

        {id: 2, total_Provisioned_Vehicles: 200,
        total_Provisioned_TCUs: 600,
        total_Subscribed_Bundles: 7000,
        total_Demo_Bundles: 2000,
        eCall: 20},

        {id: 3, total_Provisioned_Vehicles: 300,
        total_Provisioned_TCUs: 700,
        total_Subscribed_Bundles: 8000,
        total_Demo_Bundles: 3000,
        eCall: 30},

        {id: 4, total_Provisioned_Vehicles: 400,
        total_Provisioned_TCUs: 800,
        total_Subscribed_Bundles: 9000,
        total_Demo_Bundles: 4000,
        eCall: 40},

        {id: 5, total_Provisioned_Vehicles: 500,
        total_Provisioned_TCUs: 900,
        total_Subscribed_Bundles: 10000,
        total_Demo_Bundles: 5000,
        eCall: 50},

      ]);
    });
};
