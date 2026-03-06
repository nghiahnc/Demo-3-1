import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // cho process.env dùng ở mọi nơi
        }),
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
