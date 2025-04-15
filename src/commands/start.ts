import type { CommandContext } from 'grammy';
import type { MyContext } from '../types/bot.type';
import { db } from '../database/db';
import {
  checkDomain,
  generateUserDataNoticeDomain,
  saveUserData,
} from '../utils';

export const startCommand = async (ctx: CommandContext<MyContext>) => {
  const telegramUserId = ctx.from?.id;
  const user = await db('user')
    .where({ telegram_user_id: telegramUserId })
    .first();
  if (!user || !user.user_data.hasStarted) {
    const domains = await db('domain');
    const checkDomainsPromises = domains.map((domain) => checkDomain(domain));
    const checkDomainsResult = await Promise.all(checkDomainsPromises);
    ctx.session.name = ctx.from?.first_name || 'User';
    ctx.session.lastAction = 'start';
    ctx.session.noticesDomain = {};
    await db('user').insert({
      telegram_user_id: ctx.from?.id,
      telegram_chat_id: ctx.chat.id,
      user_data: ctx.session,
    });
    const user = await db('user')
      .where({ telegram_user_id: ctx.from?.id })
      .first();
    if (!user) {
      await ctx.reply(
        'Произошла ошибка при создании пользователя. Пожалуйста, попробуйте позже.'
      );
      return;
    }
    const userNoticesDomain = generateUserDataNoticeDomain(
      checkDomainsResult,
      user
    );
    await saveUserData(user, {
      noticesDomain: userNoticesDomain,
    });
    await ctx.reply(
      `Добро пожаловать, ${ctx.session.name}! 🎉\nВаши данные сохранены в сессии.`
    );
  } else {
    ctx.session = user.user_data;
    await ctx.reply(
      `Вы уже нажали "Старт". Добро пожаловать обратно, ${ctx.session.name}!`
    );
  }
};
