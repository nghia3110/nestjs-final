import { Module } from "@nestjs/common";
import { UsersModule } from "../users";
import { StoresModule } from "../stores";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";

@Module({
    imports: [
        UsersModule,
        StoresModule
    ],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule {}