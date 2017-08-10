
exports.up = function(knex, Promise) {
    return Promise.all([

      knex.schema.createTable('report1', function(report1Table){
        report1Table.increments('id').primary();
        report1Table.integer('total_Provisioned_Vehicles').notNullable().unique();
        report1Table.integer('total_Provisioned_TCUs').notNullable().unique();
        report1Table.integer('total_Subscribed_Bundles').notNullable().unique();
        report1Table.integer('total_Demo_Bundles').notNullable().unique();
        report1Table.integer('eCall').notNullable().unique();

      })

    ])
};

exports.down = function(knex, Promise) {

  return knex.schema.dropTableIfExists('report1')

};
