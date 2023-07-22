import amqp from "amqplib";
import { processTask } from "./process-task";

const uri = "amqp://mq";

let connected = false;
async function connectToMq() {
  while (!connected) {
    try {
      const connection = await amqp.connect(uri);
      const channel = await connection.createChannel();
      connected = true;

      return channel;
    } catch (e) {
      console.log("retrying in 1 sec");
    }
    await new Promise<void>((resolve) =>
      setTimeout(() => {
        resolve();
      }, 1000)
    );
  }
}

// TODO terminate once not active for 1 second
const MAX_IDLE = 1000; // 1 second before terminating

async function main() {
  const channel = await connectToMq();
  console.log("worker connected");

  const { queue: tasksQueue } = await channel.assertQueue("tasks_queue");

  channel.consume(tasksQueue, (rawMessage) => {
    const found = processTask(JSON.parse(rawMessage.content.toString()));
    if (found) {
      console.log(`Found! => ${found}`);
      channel.sendToQueue("sink_queue", Buffer.from(JSON.stringify(found)));
    }

    channel.ack(rawMessage);
  });
}
main().catch((err) => console.error(err));
