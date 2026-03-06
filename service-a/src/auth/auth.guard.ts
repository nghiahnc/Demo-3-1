import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { CasdoorService } from './casdoor.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private casdoorService: CasdoorService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const auth = req.headers.authorization;

        if (!auth) throw new UnauthorizedException();

        const token = auth.replace('Bearer ', '');

        const user = await this.casdoorService.getUserInfo(token);

        if (!user?.name) {
            throw new UnauthorizedException();
        }

        req.user = {
            id: user.id,
            name: user.name,
        };

        return true;
    }
}
