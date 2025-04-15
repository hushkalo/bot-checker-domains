import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('available_user', (table) => {
    table.increments('id').primary();
    table.bigInteger('telegram_user_id').notNullable().unique();
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
  return knex.schema.dropTableIfExists('available_user');
}
