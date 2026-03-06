import * as dotenv from 'dotenv';
dotenv.config();

import Stripe from 'stripe';
import axios from 'axios';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const DIRECTUS_URL = process.env.DIRECTUS_URL!;
const DIRECTUS_EMAIL = process.env.DIRECTUS_EMAIL!;
const DIRECTUS_PASSWORD = process.env.DIRECTUS_PASSWORD!;

let accessToken: string | null = null;


// login() dùng để đăng nhập vào Directus và lấy accessToken
async function login() {

    if (accessToken) return accessToken;

    const res = await axios.post(`${DIRECTUS_URL}/auth/login`, {
        email: DIRECTUS_EMAIL,
        password: DIRECTUS_PASSWORD,
    });

    accessToken = res.data.data.access_token;

    return accessToken;
}
async function getUserIdByUsername(username: string) {

    const token = await login();

    const res = await axios.get(
        `${DIRECTUS_URL}/items/user`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const user = res.data.data[0];

    const id = user?.id;

    console.log(id);

    return id;
}   

// createPayment(id, username, amount)
// dùng để tạo payment record
export async function createPayment(
    fruitId: string,
    username: string,
    amount: number
) {

    const iduser = await getUserIdByUsername(username);

    console.log("=== CREATE PAYMENT ===");
    console.log("Fruit ID:", fruitId);
    console.log("User:", username);
    console.log("Amount:", amount);
    console.log("User ID:", iduser);

    const token = await login();

    const res = await axios.post(
        `${DIRECTUS_URL}/items/payment`,
        {
            amount: amount * 1000,
            user: iduser,
            fruit: fruitId,
            status: "pending"
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const payment = res.data.data;

    console.log("Payment created:", payment.id);

    return payment;
}


// chargeStripe(amount)
// gọi Stripe để tạo paymentIntent
export async function chargeStripe(amount: number) {

    console.log("=== CHARGE STRIPE ===");
    console.log("Amount:", amount);

    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 1000,
        currency: 'vnd',
        automatic_payment_methods: {
            enabled: true,
            allow_redirects: 'never',
        },
        payment_method: 'pm_card_visa',
        confirm: true,
    });

    console.log("Stripe PaymentIntent:", paymentIntent.id);

    return paymentIntent.status;
}


// updatePaymentStatus(paymentId, status)
// dùng để cập nhật trạng thái payment (tạm thời chỉ log)

export async function updatePaymentStatus(
    paymentId: string,
    status: string
) {

    console.log("=== UPDATE PAYMENT STATUS ===");
    console.log("Payment ID:", paymentId);
    console.log("Status:", status);

    const token = await login();

    const res = await axios.patch(
        `${DIRECTUS_URL}/items/payment/${paymentId}`,
        {
            status: status
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return res.data.data;
}