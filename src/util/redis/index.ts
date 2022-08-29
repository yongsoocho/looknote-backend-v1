import { createClient } from 'redis';
import * as dotenv from 'dotenv';

dotenv.config();

export const RedisClient = createClient({
  url: process.env.REDIS_HOST,
});
