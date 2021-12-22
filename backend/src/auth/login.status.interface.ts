import { UserEntity } from "src/user/user.entity";

export interface LoginStatus {
  username: string;
  accessToken: any;
  expiresIn: any;
}
