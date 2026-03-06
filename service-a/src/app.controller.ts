import { Controller, Get, Param } from '@nestjs/common';
import { DirectusService } from './directus.service';

@Controller()
export class AppController {
    constructor(private readonly directusService: DirectusService) { }

    @Get('fruits')
    getAllFruits() {
        return this.directusService.getAllFruits();
    }

    @Get('fruits/:id')
    getFruit(@Param('id') id: string) {
        return this.directusService.getFruitById(+id);
    }
}