import type { CommandContext } from 'grammy';
import type { MyContext } from '../types/bot.type';
import { db } from '../database/db';
import { checkDomain, generateTelegramResponse } from '../utils';

export const checkCommand = async (ctx: CommandContext<MyContext>) => {
  try {
    const domains = await db('domain');
    if (domains.length === 0) {
      await ctx.reply('Нет доменов для проверки.');
      return;
    }
    const promises = domains.map(async (domain) => checkDomain(domain));
    const results = await Promise.all(promises);
    const telegramMessage = generateTelegramResponse(results);
    await ctx.reply(telegramMessage, {
      parse_mode: 'Markdown',
    });
  } catch (error) {
    console.error('Error checking domains:', error);
    await ctx.reply('Произошла ошибка при проверке доменов.');
  }
};
