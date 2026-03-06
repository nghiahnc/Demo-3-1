import { Module } from '@nestjs/common';
import { CasdoorService } from './casdoor.service';
import { AuthGuard } from './auth.guard';

@Module({
    providers: [CasdoorService, AuthGuard],
    exports: [CasdoorService, AuthGuard],
})
export class AuthModule { }
