import { Module } from "@nestjs/common";
import { StoresModule } from "../stores";
import { UsersModule } from "../users";
import { OrdersModule } from "../orders";
import { RedeemsModule } from "../redeems";
import { OrderRedeemController } from "./order-redeem.controller";
import { OrderRedeemService } from "./order-redeem.service";

@Module({
    imports: [
        StoresModule,
        UsersModule,
        OrdersModule,
        RedeemsModule
    ],
    controllers: [OrderRedeemController],
    providers: [OrderRedeemService],
    exports: [OrderRedeemService]
})
export class OrderRedeemModule {}