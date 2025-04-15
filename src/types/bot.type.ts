import { UserData } from './knex';
import { Context, SessionFlavor } from 'grammy';

export interface MySession extends UserData {}

export type MyContext = Context & SessionFlavor<MySession>;
