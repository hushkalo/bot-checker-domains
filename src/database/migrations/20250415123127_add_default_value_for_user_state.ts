import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('user', (table) => {
    table
      .jsonb('user_data')
      .defaultTo({ hasStarted: false, name: '', lastAction: '' })
      .alter();
  });
}

export async function down(knex: Knex): Promise<void> {}
