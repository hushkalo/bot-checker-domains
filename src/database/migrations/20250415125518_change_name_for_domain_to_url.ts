import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('domain', (table) => {
    table.renameColumn('domain', 'url');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('domain', (table) => {
    table.renameColumn('url', 'domain');
  });
}
