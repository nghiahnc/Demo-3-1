import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DirectusService {
    private accessToken: string | null = null;

    constructor(private readonly config: ConfigService) { }

    private async login() {
        if (this.accessToken) return;

        const res = await axios.post(
            `${this.config.get('DIRECTUS_URL')}/auth/login`,
            {
                email: this.config.get('DIRECTUS_EMAIL'),
                password: this.config.get('DIRECTUS_PASSWORD'),
            }
        );

        this.accessToken = res.data.data.access_token;
    }

    async getFruitById(id: number) {
        await this.login();

        const res = await axios.get(
            `${this.config.get('DIRECTUS_URL')}/items/fruits/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            }
        );

        const fruit = res.data.data;

        return {
            ...fruit,
            img: fruit.img
                ? `${this.config.get('DIRECTUS_URL')}/assets/${fruit.img}`
                : null,
        };
    }


    async getAllFruits() {
        await this.login();

        const res = await axios.get(
            `${this.config.get('DIRECTUS_URL')}/items/fruits`,
            {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            }
        );

        const fruits = res.data.data;

        return fruits.map((fruit) => ({
            ...fruit,
            img: fruit.img
                ? `${this.config.get('DIRECTUS_URL')}/assets/${fruit.img}`
                : null,
        }));
    }
}