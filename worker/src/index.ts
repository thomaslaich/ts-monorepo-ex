import amqp from "amqplib";
import { processTask } from "./process-task";

const message = process.argv[0];

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

async function main() {
  const channel = await connectToMq();
  console.log("worker connected");

  const found = processTask(JSON.parse(message));
  if (found) {
    console.log(`Found! => ${found}`);
    channel.sendToQueue("sink_queue", Buffer.from(JSON.stringify(found)));
  }
}
main().catch((err) => console.error(err));
