import {
  DomainStatusNotice,
  ResponseCheckAvailableDomain,
} from './types/common.type';
import axios, { AxiosError } from 'axios';
import { db } from './database/db';
import { CheckDomain, User } from 'knex/types/tables';
import type { TNoticesDomain, UserData } from './types/knex';
import { axiosErrorCodeMap } from './maps/error-code.map';

export const generateTelegramResponse = (
  data: ResponseCheckAvailableDomain[]
): string => {
  let response = '🔍 Результаты проверки доменов:\n\n';

  const successDomains = data.filter((item) => item.status === 'success');
  if (successDomains.length > 0) {
    response += '✅ Успешные:\n';
    successDomains.forEach((item, index) => {
      response += `${index + 1}. [${item.name}](${item.url}) - ${item.message} (Код: ${item.status_code})\n`;
    });
    response += '\n';
  }

  const errorDomains = data.filter((item) => item.status === 'error');
  if (errorDomains.length > 0) {
    response += '❌ Ошибки:\n';
    errorDomains.forEach((item, index) => {
      response += `${index + 1}. [${item.name}](${item.url}) - ${item.message} (Код: ${item.status_code})\n`;
    });
  }
  return response;
};

export const generateTelegramMessageForDomainStatus = (
  domains: DomainStatusNotice[]
): string => {
  let errorBlock = '';
  let restoredBlock = '';

  for (const { name, url, previousStatus, currentStatus } of domains) {
    const link = url ? `[${name}](${url})` : name;

    // Впав
    if (currentStatus === 'error' && previousStatus !== 'error') {
      errorBlock += `🔴 ${link} — *недоступен*\n`;
    }

    // Відновився
    if (currentStatus === 'success' && previousStatus === 'error') {
      restoredBlock += `🟢 ${link} — *восстановлен*\n`;
    }
  }

  let message = '';

  if (errorBlock) {
    message += '🚨 *Домен(ы) упали:*\n' + errorBlock + '\n';
  }

  if (restoredBlock) {
    message += '✅ *Домен(ы) восстановлены:*\n' + restoredBlock;
  }

  return message || 'Нет изменений по доменам.';
};

export const checkDomain = async (
  domain: CheckDomain
): Promise<ResponseCheckAvailableDomain> => {
  try {
    const response = await axios.get(domain.url, {
      timeout: 30000,
    });
    await db('domain').where({ id: domain.id }).update({
      status: 'success',
      message: response.statusText,
      status_code: response.status,
    });
    return {
      status: 'success',
      name: domain.name,
      message: response.statusText,
      status_code: response.status,
      url: domain.url,
    };
  } catch (error) {
    const statusCode =
      error instanceof AxiosError ? (error.response?.status ?? 0) : 0;
    const message =
      error instanceof AxiosError ? error.message : 'Unknown error';

    let dbStatus = 'error';
    if (error instanceof AxiosError && error.code) {
      if (error.code === 'ECONNABORTED') {
        dbStatus = 'timeout';
      } else {
        dbStatus =
          axiosErrorCodeMap[error.code] || `Unknown error code: ${error.code}`;
        await db('domain').where({ id: domain.id }).update({
          status: error.code,
          message,
          status_code: 0,
        });
        return {
          status: error.code,
          name: domain.name,
          message: dbStatus,
          status_code: 0,
          url: domain.url,
        };
      }
    }

    await db('domain').where({ id: domain.id }).update({
      status: dbStatus,
      message,
      status_code: statusCode,
    });

    return {
      status: 'error',
      message,
      name: domain.name,
      status_code: statusCode,
      url: domain.url,
    };
  }
};

export const generateUserDataNoticeDomain = (
  data: ResponseCheckAvailableDomain[],
  user: User
): TNoticesDomain =>
  data.reduce((acc, domain) => {
    const noticeData = user.user_data?.noticesDomain?.[domain.name];
    acc[domain.name] = noticeData ?? {
      isNoticed: false,
      status: domain.status,
    };
    return acc;
  }, {} as TNoticesDomain);

export const saveUserData = async (
  user: User,
  userData: Partial<UserData>
): Promise<void> => {
  await db('user')
    .where({ telegram_user_id: user.telegram_user_id })
    .update({
      user_data: {
        ...user.user_data,
        ...userData,
      },
    });
};
