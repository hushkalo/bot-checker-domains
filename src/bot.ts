import { Bot, session } from 'grammy';
import type { MyContext, MySession } from './types/bot.type';
import { checkAvailableUser } from './middleware';
import {
  addCommand,
  checkCommand,
  newUserCommand,
  startCommand,
} from './commands';
import { configuration } from './config';

const bot = new Bot<MyContext>(configuration.telegram.token || '');
bot.use(
  session({
    initial(): MySession {
      return {
        hasStarted: false,
        name: '',
        lastAction: '',
        noticesDomain: {},
        isBlocked: false,
      };
    },
  })
);
bot.use(checkAvailableUser);

bot.command('start', startCommand);
bot.command('add', addCommand);
bot.command('check', checkCommand);
bot.command('new_user', newUserCommand);

export default bot;
