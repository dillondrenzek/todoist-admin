import dotenv from 'dotenv';

export interface AppEnvironment {
  APP_PORT: number;
  DEBUG: boolean;
}

export default function (): AppEnvironment {
  const { error, parsed } = dotenv.config();

  if (error) {
    console.error('Error: no .env file found!');
    process.exit(1);
  }

  return {
    APP_PORT: parseInt(parsed.APP_PORT, 10),
    DEBUG: !!parsed.DEBUG,
  };
}
