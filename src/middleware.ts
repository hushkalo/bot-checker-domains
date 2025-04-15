import { db } from './database/db';
import type { MyContext } from './types/bot.type';
import type { NextFunction } from 'grammy';

export const checkAvailableUser = async (
  ctx: MyContext,
  next: NextFunction
) => {
  if (!ctx.session.name) {
    ctx.session.name = ctx.from?.first_name || 'User';
    const availableUsers = await db('available_user');
    const isAvailableUser = availableUsers.find(
      (user) => Number(user.telegram_user_id) === ctx.from?.id
    );
    if (!isAvailableUser) {
      ctx.session.isBlocked = true;
      await ctx.reply(
        'Вы не зарегистрированы в системе. Пожалуйста, обратитесь к администратору.'
      );
      return;
    }
  }
  if (ctx.session.isBlocked) {
    await ctx.reply(
      'Вы не зарегистрированы в системе. Пожалуйста, обратитесь к администратору.'
    );
    return;
  }
  return await next();
};
