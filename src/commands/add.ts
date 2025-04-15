import type { CommandContext } from 'grammy';
import type { MyContext } from '../types/bot.type';
import { db } from '../database/db';

export const addCommand = async (ctx: CommandContext<MyContext>) => {
  ctx.session.lastAction = 'add_domain';
  const domain = ctx.message?.text.split(' ')[2];
  const name = ctx.message?.text.split(' ')[1];

  if (!name) {
    await ctx.reply('Пожалуйста, укажите имя домена.');
    return;
  }

  if (!domain) {
    await ctx.reply('Пожалуйста, укажите домен для добавления.');
    return;
  }

  await db('domain').insert({
    url: domain,
    name: name,
    status: 'added',
    message: '',
  });
  await ctx.reply(`Домен ${domain} добавлен для проверки.`);
};
