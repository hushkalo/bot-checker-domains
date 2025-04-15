import { db } from './database/db';
import {
  checkDomain,
  generateTelegramMessageForDomainStatus,
  generateUserDataNoticeDomain,
} from './utils';
import type { TNoticesDomain } from './types/knex';
import type { DomainStatusNotice } from './types/common.type';
import bot from './bot';

export const cronTaskCheckDomain = async () => {
  const users = await db('user');
  const domains = await db('domain');
  const checkDomainResult = await Promise.all(
    domains.map((domain) => checkDomain(domain))
  );

  const userSendMessagePromises = users.map(async (user) => {
    const userNoticesDomain = generateUserDataNoticeDomain(
      checkDomainResult,
      user
    );

    const domainChanges: DomainStatusNotice[] = [];
    for (const domain of checkDomainResult) {
      const prev = userNoticesDomain[domain.name];
      const currentStatus = domain.status;
      const previousStatus = prev.status;
      const isNoticed = prev.isNoticed;

      const isNowBroken = currentStatus === 'error' && !isNoticed;
      const isRestored =
        previousStatus === 'error' && currentStatus === 'success';

      if (isNowBroken || isRestored) {
        domainChanges.push({
          name: domain.name,
          url: domain.url,
          previousStatus,
          currentStatus,
        });

        userNoticesDomain[domain.name] = {
          isNoticed: currentStatus === 'error',
          status: currentStatus,
        };
      }
    }

    if (domainChanges.length === 0) return;

    await db('user')
      .where({ id: user.id })
      .update({
        user_data: {
          ...user.user_data,
          noticesDomain: userNoticesDomain,
        },
      });

    const telegramMessage =
      generateTelegramMessageForDomainStatus(domainChanges);

    try {
      return await bot.api.sendMessage(user.telegram_chat_id, telegramMessage, {
        parse_mode: 'Markdown',
      });
    } catch (err) {
      console.error(
        `Ошибка при отправке сообщения юзеру ${user.telegram_chat_id}:`,
        err
      );
    }
  });

  await Promise.all(userSendMessagePromises);
};
