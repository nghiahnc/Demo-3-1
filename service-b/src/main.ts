import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.use(
        session({
            secret: 'secret-key',
            resave: false,
            saveUninitialized: false,
        }),
    );

    app.setBaseViewsDir(path.join(__dirname, '..', 'src', 'views'));
    app.setViewEngine('ejs');

    await app.listen(process.env.PORT ?? 3001);
}
bootstrap();