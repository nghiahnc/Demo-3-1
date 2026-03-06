import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { WorkflowService } from './workflow.service';

@Module({
    imports: [AuthModule],
    controllers: [AppController],
    providers: [WorkflowService],
})
export class AppModule { }