import type { CommandContext } from 'grammy';
import type { MyContext } from '../types/bot.type';
import { db } from '../database/db';

export const newUserCommand = async (ctx: CommandContext<MyContext>) => {
  const id = ctx.message?.text.split(' ')[1];

  if (!id) {
    await ctx.reply('Пожалуйста, укажите id юзера.');
    return;
  }

  await db('available_user').insert({
    telegram_user_id: Number(id),
  });
  await ctx.reply(`Новый юзер добавлен: ${id}`);
};
