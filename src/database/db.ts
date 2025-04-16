import Knex from 'knex';
import knexConfig from '../../knexfile';
import { configuration } from '../config';

export const db = Knex(knexConfig[configuration.server.nodeEnvironment]);
console.log(knexConfig[configuration.server.nodeEnvironment]);
