import {
    Body,
    Controller,
    HttpCode,
    Post,
    UseGuards
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiOperation,
    ApiTags
} from "@nestjs/swagger";
import { TStore, TUser } from "src/types";
import { Store, StoreGuard, User, UserGuard } from "src/utils";
import { CreateOrderDto } from "../orders";
import { CreateRedeemDto } from "../redeems";
import { OrderRedeemService } from "./order-redeem.service";

@ApiTags('order-redeem')
@Controller('order-redeem')
export class OrderRedeemController {
    constructor(private orderRedeemService: OrderRedeemService) { }

    @ApiOperation({ summary: 'API create order' })
    @ApiBearerAuth()
    @UseGuards(StoreGuard)
    @Post('/orders')
    @HttpCode(201)
    async createOrder(
        @Body() body: CreateOrderDto,
        @Store() store: TStore) {
        return this.orderRedeemService.createOrder(body, store.id);
    }

    @ApiOperation({ summary: 'API create redeem' })
    @ApiBearerAuth()
    @UseGuards(UserGuard)
    @Post('/redeems')
    @HttpCode(201)
    async createRedeem(
        @Body() body: CreateRedeemDto,
        @User() user: TUser) {
        return this.orderRedeemService.createRedeem(body, user.id);
    }
}