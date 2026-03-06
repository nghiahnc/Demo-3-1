import fetch from 'node-fetch';
import 'dotenv/config';

const DIRECTUS_URL = process.env.DIRECTUS_URL!;
const EMAIL = process.env.DIRECTUS_EMAIL!;
const PASSWORD = process.env.DIRECTUS_PASSWORD!;
export async function getDirectusAccessToken(): Promise<string> {
    console.log('[Directus] get access token for', DIRECTUS_URL);
    const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: EMAIL,
            password: PASSWORD,
        }),
    });

    const json = (await res.json()) as any;
    return json.data.access_token;
}
