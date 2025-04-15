import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user', (table) => {
    table.bigInteger('telegram_user_id').notNullable().alter();
    table.bigInteger('telegram_chat_id').notNullable().alter();
  });

  await knex.schema.alterTable('available_user', (table) => {
    table.bigInteger('telegram_user_id').notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user', (table) => {
    table.integer('telegram_user_id').notNullable().alter();
    table.integer('telegram_chat_id').notNullable().alter();
  });

  await knex.schema.alterTable('available_user', (table) => {
    table.integer('telegram_user_id').notNullable().alter();
  });
}
