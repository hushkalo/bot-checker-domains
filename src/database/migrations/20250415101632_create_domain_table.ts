import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('domain', (table) => {
    table.increments('id').primary();
    table.string('domain').notNullable().unique();
    table.string('status').notNullable();
    table.string('message').notNullable();
    table
      .timestamp('created_at', {
        useTz: true,
      })
      .defaultTo(knex.fn.now())
      .notNullable();

    table
      .timestamp('updated_at', {
        useTz: true,
      })
      .defaultTo(knex.fn.now())
      .notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('domain');
}
