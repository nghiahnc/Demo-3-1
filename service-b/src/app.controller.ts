import {
    Controller,
    Get,
    Post,
    Body,
    Req,
    Res,
    UseGuards,
    Query,
} from '@nestjs/common';
import axios from 'axios';
import type { Request, Response } from 'express';
import { AuthGuard } from './auth/auth.guard';
import { WorkflowService } from './workflow.service';
import Ably from 'ably';
@Controller()
export class AppController {
    constructor(
        private readonly workflowService: WorkflowService,
    ) { }
    @Get('staff-chat')
    @UseGuards(AuthGuard)
    async staffChat(@Req() req: Request, @Res() res: Response) {
        try {

            const user = (req.session as any)?.user || null;
            const username = user?.name || 'staff';
            const ABLY_KEY = "MuSJEQ.AyKWRw:yaz9v2F9x-BreFWCT-Hk5e8iv-F6HlSlDBUqk8nFEYc";
            return res.render('staff-chat', {
                user: user,
                username: username,
                ablyKey: ABLY_KEY
            });

        } catch (error: any) {

            console.error('Error loading staff chat:', error?.message || error);

            return res.status(500).render('error', {
                message: 'Không tải được trang staff chat'
            });
        }
    }
    @Get('fruits')
    @UseGuards(AuthGuard)
    async getAllFruits(@Req() req: Request, @Res() res: Response) {
        try {

            const result = await axios.get(
                `http://localhost:3500/v1.0/invoke/service-a/method/fruits`,
                {
                    headers: {
                        Authorization: req.headers['authorization'] || '',
                    },
                },
            );

     
            const ABLY_KEY = "MuSJEQ.AyKWRw:yaz9v2F9x-BreFWCT-Hk5e8iv-F6HlSlDBUqk8nFEYc";

            return res.render('fruits', {
                fruits: result.data,

                user: (req.session as any)?.user || null,
                username: (req.session as any)?.user?.name || 'Khách',

          
                ablyKey: ABLY_KEY
            });

        } catch (error: any) {

            console.error('Error fetching fruits:', error?.message || error);

            return res.status(500).render('error', {
                message: 'Không tải được danh sách trái cây',
            });
        }
    }

    @Get('order')
    order(
        @Query('id') id: string,
        @Query('name') name: string,
        @Query('price') price: string,
        @Query('qty') qty: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {

        const username = (req.session as any)?.user?.name || 'Khách';

        res.render('order', {
            id,
            name,
            price,
            qty,
            username
        });
    }

    @Post('buy')
    async buy(@Body() body: any) {

        const id = body.fruitId;
        const username = body.userName;
        const price = Number(body.price);
        const qty = Number(body.qty);

        const amount = price * qty;

        await this.workflowService.startPayment(id, amount, username);

        return {
            message: 'Payment started',
            id,
            username,
            amount
        };
    }
}