import { Injectable, Get, Req, Param } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { UserEntity } from "../user/user.entity";

@Injectable()
export class AchievementsService {
    constructor(private readonly userService: UserService) {}

    async getA(userId: number,): Promise<string[] | string> {
        let a = "" + userId;
        return a;
    }
}