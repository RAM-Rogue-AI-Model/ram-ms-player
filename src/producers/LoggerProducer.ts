import amqp, { Channel, Connection } from 'amqplib';

const RABBITMQ_URL =
  process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

const QUEUE = 'create_log_queue';

export class LoggerProducer {
  private connection?: Connection;
  private channel?: Channel;

  async connect() {
    if (this.connection && this.channel) return;

    this.connection = await amqp.connect(RABBITMQ_URL);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(QUEUE, { durable: true });

    console.log('LoggerProducer connecté à RabbitMQ');
  }

  async publish(payload: unknown) {
    await this.connect();
    console.log('Publication du message de log:', payload);
    this.channel!.sendToQueue(QUEUE, Buffer.from(JSON.stringify(payload)), {
      persistent: true,
    });
  }

  async close() {
    await this.channel?.close();
    await this.connection?.close();
  }
}
