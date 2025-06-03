import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('location')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class LocationController {
  constructor(private readonly locationService: LocationService) { }

  @Get()
  // @Roles('user')
  findAll(@Query() query: any) {
    if (Object.keys(query).length === 0) {
      return this.locationService.findAll();
    } else {
      return this.locationService.findByQuery(query);
    }
    // return this.locationService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.locationService.findById(id);
  }

}
