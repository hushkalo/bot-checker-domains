import { webhookCallback } from 'grammy';
import express from 'express';
import { schedule } from 'node-cron';
import bot from './bot';
import { configuration } from './config';
import { cronTaskCheckDomain } from './cron';

const app = express();
const PORT = configuration.server.port;

app.use(express.json());

schedule(configuration.cron.every10Second, cronTaskCheckDomain);

app.post('/webhook', webhookCallback(bot, 'express'));

app.listen(PORT, async () => {
  console.log(`Сервер вебхуков запущен на порту ${PORT}`);

  const webhookURL = configuration.telegram.webhook || '';
  await bot.api.setWebhook(webhookURL);
  console.log(`Вебхук установлен на ${webhookURL}`);
  console.log(`ENV: ${configuration.server.nodeEnvironment}`);
});

console.log('Бот запущен!');
