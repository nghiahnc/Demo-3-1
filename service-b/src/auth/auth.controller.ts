    import { Controller, Get, Req, Res } from '@nestjs/common';
    import type { Request, Response } from 'express';
    import axios from 'axios';
    import { CasdoorService } from './casdoor.service';

    @Controller('auth')
    export class AuthController {
        constructor(private casdoor: CasdoorService) { }

        @Get('login')
        login(@Req() req: Request, @Res() res: Response) {
            return res.redirect(this.casdoor.getLoginUrl());
        }
    
        @Get('callback')
        async callback(@Req() req: Request, @Res() res: Response) {
            const { code } = req.query;
            if (!code) return res.status(400).send('Missing code');

            try {
                const token = await this.casdoor.handleCallback(code as string);

                
                const userResponse = await axios.get(
                    'http://localhost:8000/api/get-account',
                    {
                        headers: {
                            Authorization: `Bearer ${token.access_token}`,
                        },
                    }
                );

                const userData = userResponse.data;
                if (userData.status !== 'ok') {
                    throw new Error('get-account failed: ' + userData.msg);
                }

                const user = userData.data; 

                req.session.user = user;
                console.log('LOGIN USER:', user);
                console.log('Username:', user.name);          
                console.log('DisplayName:', user.displayName);
                console.log('Email:', user.email);

                const redirectUrl = req.session.returnTo || '/fruits';
                delete req.session.returnTo;

                return res.redirect(redirectUrl);
            } catch (err) {
                console.error('Callback error:', err?.response?.data || err);
                return res.status(500).send('Login failed: ' + (err.message || 'Unknown error'));
            }
        }
       
    }