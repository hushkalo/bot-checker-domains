import type { Knex } from 'knex';
import { configuration } from './src/config';

const knexConfig: { [key: string]: Knex.Config } = {
  development: configuration.database.development,
  production: configuration.database.production,
};

export default knexConfig;
