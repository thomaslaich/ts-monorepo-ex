/* eslint-disable @typescript-eslint/no-non-null-assertion */
export const redisHost: string = process.env.REDIS_HOST!;
export const redisPort: number = parseInt(process.env.REDIS_PORT!);
export const amqpHost: string = process.env.AMQP_HOST!;
export const amqpPort: number = parseInt(process.env.AMQP_PORT!);
