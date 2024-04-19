import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Post,
    Put,
    Query,
    UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetListDto } from 'src/database';
import { AdminGuard, UuidParam } from 'src/utils';
import {
    CreateMethodDetailDto,
    UpdateMethodDetailDto
} from './dto';
import { MethodDetailsService } from './method-details.service';

@ApiTags('method-details')
@Controller('method-details')
export class MethodDetailsController {
    constructor(private methodDetailsService: MethodDetailsService) { }

    @ApiOperation({ summary: 'API get list method details' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get()
    @HttpCode(200)
    async getListMethodDetails(
        @Query() query: GetListDto) {
        return this.methodDetailsService.getListMethodDetails(query);
    }

    @ApiOperation({ summary: 'API get method detail by Id' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get('/:id')
    @HttpCode(200)
    async getMethodDetailById(@UuidParam('id') id: string) {
        return this.methodDetailsService.getMethodDetailById(id);
    }

    @ApiOperation({ summary: 'API create method detail' })
    @ApiBearerAuth()
    @ApiBody({
        type: CreateMethodDetailDto,
        required: true,
        description: 'Admin create method detail'
    })
    @UseGuards(AdminGuard)
    @Post()
    @HttpCode(201)
    async createMethodDetail(@Body() payload: CreateMethodDetailDto) {
        return this.methodDetailsService.createMethodDetail(payload);
    }

    @ApiOperation({ summary: 'API update method detail' })
    @ApiBody({
        type: UpdateMethodDetailDto,
        required: true,
        description: 'Admin update method detail'
    })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Put('/:id')
    @HttpCode(201)
    async updateMethodDetail(@UuidParam('id') id: string, @Body() payload: UpdateMethodDetailDto) {
        return this.methodDetailsService.updateMethodDetail(id, payload);
    }

    @ApiOperation({ summary: 'API delete method detail' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Delete('/:id')
    @HttpCode(200)
    async deleteMethodDetail(@UuidParam('id') id: string) {
        return this.methodDetailsService.deleteMethodDetail(id);
    }
}