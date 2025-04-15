import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('available_user').del();

  // Inserts seed entries
  await knex('available_user').insert([
    {
      telegram_user_id: 123123123,
    },
  ]);
}
