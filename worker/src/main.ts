import { Worker, NativeConnection } from '@temporalio/worker';
import * as activities from './activities/payment.activity';
import 'dotenv/config';

async function run() {
  const connection = await NativeConnection.connect({
    address: '127.0.0.1:7233',
  });

  const worker = await Worker.create({
    connection,
    workflowsPath: require.resolve('./workflows/payment.workflow'),
    activities,
    taskQueue: 'payment-queue',
  });

  console.log('Worker started on taskQueue: payment-queue');
  await worker.run();
}

run();