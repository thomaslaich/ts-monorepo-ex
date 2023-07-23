import amqp from "amqplib";
import { generateTasks } from "./generate-tasks";
// TODO use ts-rest
import express from "express";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
const BATCH_SIZE = 10000;

// TODO use env var
const PORT = 5000;

const uri = `amqp://${process.env.AMQP_HOST}`;

console.log("aaah", uri);

let connected = false;
async function connectToMq() {
  while (!connected) {
    try {
      const connection = await amqp.connect(uri);
      const channel = await connection.createConfirmChannel();
      connected = true;

      return channel;
    } catch (e) {
      console.log("retrying in 1 sec", JSON.stringify(e));
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
  console.log("orchestrator connected");

  const { queue: tasksQueue } = await channel.assertQueue("tasks_queue");

  const { queue: sinkQueue } = await channel.assertQueue("sink_queue");

  // ventilator
  // const ventilator = null;
  // ventilator.bind("tcp://*:5016");
  // await delay(1000); // wait for all the workers to connect

  // collector
  // const sink = zmq.socket("pull");
  // sink.bind("tcp://*:5017");

  // for await (const rawMessage of sink) {
  //   const message: Message = JSON.parse(rawMessage.toString());
  //   eventEmitter.emit(`result_${message.searchHash}`, message.word);
  // }

  const app = express();
  app.use(express.json());

  app.get("/hello", (req, res) => {
    res.status(200).send("world");
  });

  app.get("/", async (req, res) => {
    const { searchHash, maxLength } = req.query as {
      searchHash: string;
      maxLength: string;
    };
    console.log("searchHash", searchHash);
    const generatorObj = generateTasks(
      searchHash,
      ALPHABET,
      parseInt(maxLength),
      BATCH_SIZE
    );

    for (const task of generatorObj) {
      channel.sendToQueue(tasksQueue, Buffer.from(JSON.stringify(task)), {
        persistent: true,
      });
    }
    await channel.waitForConfirms();

    let word: any;
    try {
      word = await new Promise((resolve, reject) => {
        setTimeout(() => {
          reject();
        }, 30000); // max 30 seconds
        channel.consume(sinkQueue, (msg) => {
          resolve(JSON.parse(msg.content.toString()));
        });
      });
    } catch {
      res.status(500).send("timeout");
      return;
    }

    res.status(200).json({ result: word });
  });

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

main().catch((err) => console.error(err));
