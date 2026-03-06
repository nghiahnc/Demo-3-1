import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { CasdoorService } from './casdoor.service';

@Module({
    controllers: [AuthController],
    providers: [CasdoorService],
    exports: [CasdoorService],
})
export class AuthModule { }