import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DirectusService } from './directus.service';

import { AuthGuard } from './auth/auth.guard';
import { CasdoorService } from './auth/casdoor.service';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
    ],
    controllers: [AppController],
    providers: [
        DirectusService,
        CasdoorService,
        AuthGuard,
    ],
})
export class AppModule { }