import { webhookCallback } from 'grammy';
import express from 'express';
import { schedule } from 'node-cron';
import bot from './bot';
import { configuration } from './config';
import { cronTaskCheckDomain } from './cron';

const app = express();
const PORT = 3002;

app.use(express.json());
app.use(webhookCallback(bot, 'express'));

schedule(configuration.cron.every10Second, cronTaskCheckDomain);

app.use('/webhook', webhookCallback(bot, 'express'));

app.listen(PORT, async () => {
  console.log(`Сервер вебхуков запущен на порту ${PORT}`);

  const webhookURL = configuration.telegram.webhook || '';
  await bot.api.setWebhook(webhookURL);
  console.log(`Вебхук установлен на ${webhookURL}`);
});

console.log('Бот запущен!');
