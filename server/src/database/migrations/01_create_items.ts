import Knex from 'knex';
// create table
export async function up(knex: Knex) {
    return knex.schema.createTable('items', table => {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.string('image').notNullable();

    });
}

//back (delete tabel)
export async function down(knex: Knex) {
    return knex.schema.dropTable('items');
}