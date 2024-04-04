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
    CreateMethodDto,
    UpdateMethodDto
} from './dto';
import { MethodsService } from './methods.service';

@ApiTags('methods')
@Controller('methods')
export class MethodsController {
    constructor(private methodsService: MethodsService) { }

    @ApiOperation({ summary: 'API get list methods' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get()
    @HttpCode(200)
    async getListMethods(
        @Query() query: GetListDto) {
        return await this.methodsService.getListMethods(query);
    }

    @ApiOperation({ summary: 'API get method by Id' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get('/:id')
    @HttpCode(200)
    async getMethodById(@UuidParam('id') id: string) {
        return await this.methodsService.findById(id);
    }

    @ApiOperation({ summary: 'API create method' })
    @ApiBearerAuth()
    @ApiBody({
        type: CreateMethodDto,
        required: true,
        description: 'Admin create method'
    })
    @UseGuards(AdminGuard)
    @Post()
    @HttpCode(201)
    async createMethod(@Body() payload: CreateMethodDto) {
        return await this.methodsService.createMethod(payload);
    }

    @ApiOperation({ summary: 'API update method' })
    @ApiBody({
        type: UpdateMethodDto,
        required: true,
        description: 'Admin update method'
    })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Put('/:id')
    @HttpCode(201)
    async updateMethod(@UuidParam('id') id: string, @Body() payload: UpdateMethodDto) {
        return await this.methodsService.updateMethod(id, payload);
    }

    @ApiOperation({ summary: 'API delete method' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Delete('/:id')
    @HttpCode(200)
    async deleteMethod(@UuidParam('id') id: string) {
        return await this.methodsService.deleteMethod(id);
    }
}