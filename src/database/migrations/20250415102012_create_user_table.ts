import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user', (table) => {
    table.increments('id').primary();
    table.bigInteger('telegram_user_id').notNullable().unique();
    table.bigInteger('telegram_chat_id').notNullable();
    table.jsonb('user_data').notNullable();
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
  return knex.schema.dropTableIfExists('user');
}
