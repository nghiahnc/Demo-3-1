import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';

@Injectable()
export class CasdoorService {
    async getUserInfo(accessToken: string) {
        try {
            const decoded: any = jwt.decode(accessToken);

            if (!decoded) return null;

          
            return {
                name: decoded.name || decoded.username,
                id: decoded.sub,
            };
        } catch (err) {
            return null;
        }
    }
}
