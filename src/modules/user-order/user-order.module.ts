import { Module } from "@nestjs/common";
import { MethodDetailsModule } from "../method-details";
import { OrdersModule } from "../orders";
import { UsersModule } from "../users";
import { UserOrderService } from "./user-order.service";

@Module({
    imports: [UsersModule, OrdersModule, MethodDetailsModule],
    providers: [UserOrderService],
    exports: [UserOrderService]
})
export class UserOrderModule {}