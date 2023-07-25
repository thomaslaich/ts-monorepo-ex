import amqp from 'amqplib';
import { processTask } from './process-task';
import { ResultMessage, TaskMessage } from '@mono-ex/worker-contract';

const uri = 'amqp://guest:guest@rabbitmq-service:5672';

const RETRY_WAIT = 5000;

let connected = false;
async function connectToMq() {
  while (!connected) {
    try {
      const connection = await amqp.connect(uri);
      const channel = await connection.createChannel();
      connected = true;

      return channel;
    } catch (e) {
      const tick = new Date().getTime();
      console.log(`retrying in ${RETRY_WAIT} sec`);
    }
    await new Promise<void>((resolve) =>
      setTimeout(() => {
        resolve();
      }, RETRY_WAIT),
    );
  }
}

async function main() {
  const channel = await connectToMq();
  console.log('worker connected');

  channel.consume('tasks_queue', (message) => {
    const tick = new Date().getTime();

    const found = processTask(
      TaskMessage.parse(JSON.parse(message.content.toString())),
    );
    if (found) {
      console.log(`Found! => ${found}`);
      channel.sendToQueue(
        'results_queue',
        Buffer.from(JSON.stringify(ResultMessage.parse(found))),
      );
    }
  });
}
main().catch((err) => console.error(err));
