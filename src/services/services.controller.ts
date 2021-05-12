import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Role } from '../auth/constants';
import { Auth } from '../auth/decorator/roles.decorator';
import { ParseObjectIdPipe } from '../shared/pipes/objectid-pipe';
import { Service } from './service.schema';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly serviceService: ServicesService) {}

  @Auth(Role.ADMIN)
  @Post()
  async create(@Body() req: Service) {
    const createdService = await this.serviceService.create(req);
    return createdService;
  }

  @Auth(Role.ADMIN)
  @Put(':id')
  async update(@Param('id', ParseObjectIdPipe) id, @Body() req: Service) {
    const createdService = await this.serviceService.update(id, req);
    return createdService;
  }

  @Get()
  async query(): Promise<Service[]> {
    const services = await this.serviceService.query();
    return services;
  }

  @Auth(Role.ADMIN)
  @Delete(':id')
  async delete(@Param('id', ParseObjectIdPipe) id: string): Promise<Service> {
    const service = await this.serviceService.delete(id);
    return service;
  }

  @Get('categories')
  async serviceCategories(): Promise<string[]> {
    const categories = await this.serviceService.queryCategories();
    return categories;
  }
}
