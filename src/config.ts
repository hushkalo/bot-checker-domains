import { config } from 'dotenv';

config({
  debug: true,
});

export const configuration = {
  telegram: {
    token: process.env.BOT_SECRET_TOKEN,
    webhook: process.env.WEBHOOK_URL,
  },
  database: {
    development: {
      client: 'pg',
      connection: {
        host: '127.0.0.1',
        port: 5432,
        user: 'postgres',
        password: 'postgres',
        database: 'bot_checker_domain',
      },
      migrations: {
        directory: './src/database/migrations',
      },
      seeds: {
        directory: './src/database/seeds',
      },
    },
    production: {
      client: 'pg',
      connection: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      },
      migrations: {
        directory: './src/database/migrations',
      },
      seeds: {
        directory: './src/database/seeds',
      },
    },
  },
  availableUsers: [
    {
      telegram_user_id: '123456789',
      name: 'John Doe',
      isBlocked: false,
    },
    // Add more users as needed
  ],
  cron: {
    every10Second: '*/10 * * * * *',
    every20Second: '*/20 * * * * *',
    every30Second: '*/30 * * * * *',
    every1Minute: '*/1 * * * *',
    every5Minute: '*/5 * * * *',
  },
  server: {
    nodeEnvironment: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 8080,
  },
};
