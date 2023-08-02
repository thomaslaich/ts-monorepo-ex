/* eslint-disable @typescript-eslint/no-non-null-assertion */
export const redisHost: string = process.env.REDIS_HOST!;
export const redisPort: number = parseInt(process.env.REDIS_PORT!);
export const amqpHost: string = process.env.AMQP_HOST!;
export const amqpPort: number = parseInt(process.env.AMQP_PORT!);
export const pgUser: string = process.env.PG_USER!;
export const pgHost: string = process.env.PG_HOST!;
export const pgDatabase: string = process.env.PG_DATABASE!;
export const pgPassword: string = process.env.PG_PASSWORD!;
export const pgPort: number = parseInt(process.env.PG_PORT!);
