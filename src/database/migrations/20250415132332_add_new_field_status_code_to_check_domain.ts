import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('domain', (table) => {
    table.integer('status_code').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('domain', (table) => {
    table.dropColumn('status_code');
  });
}
