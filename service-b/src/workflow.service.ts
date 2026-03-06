import { Injectable } from '@nestjs/common';
import { Client, Connection } from '@temporalio/client';

@Injectable()
export class WorkflowService {
    private client: Client;

    constructor() {

        const connection = Connection.lazy({
            address: '127.0.0.1:7233',
        });

        this.client = new Client({ connection });
    }

    async startPayment(id: string, amount: number, username: string) {

        await this.client.workflow.start(
            'paymentWorkflow',
            {
                taskQueue: 'payment-queue',
                workflowId: `payment-${id}-${Date.now()}`,
                args: [id, amount, username] as any[],
            },
        );

        console.log("=== START PAYMENT WORKFLOW ===");
        console.log("Fruit ID:", id);
        console.log("Username:", username);
        console.log("Amount:", amount);
    }
}