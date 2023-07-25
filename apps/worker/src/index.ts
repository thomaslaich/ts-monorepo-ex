import amqp from 'amqplib';
import { processTask } from './process-task';
import { ResultMessage, TaskMessage } from '@mono-ex/worker-contract';

const uri = 'amqp://guest:guest@rabbitmq-service:5672';

let connected = false;
async function connectToMq() {
  while (!connected) {
    try {
      const connection = await amqp.connect(uri);
      const channel = await connection.createChannel();
      connected = true;

      return channel;
    } catch (e) {
      console.log('retrying in 1 sec');
    }
    await new Promise<void>((resolve) =>
      setTimeout(() => {
        resolve();
      }, 1000),
    );
  }
}

async function main() {
  const channel = await connectToMq();
  console.log('worker connected');

  channel.consume('tasks_queue', (message) => {
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
