import { proxyActivities } from '@temporalio/workflow';
import type * as activities from '../activities/payment.activity';

const { createPayment, chargeStripe, updatePaymentStatus } =
    proxyActivities<typeof activities>({
        startToCloseTimeout: '1 minute',
    });

export async function paymentWorkflow(
    id: string,
    amount: number,
    username: string,
) {

    const payment = await createPayment(id, username, amount);

    try {

        await chargeStripe(amount);

        await updatePaymentStatus(payment.id, 'success');

    } catch (err) {

        await updatePaymentStatus(payment.id, 'failed');

        throw err;
    }

}