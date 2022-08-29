import { DataBaseUser, DefaultUserResponse } from "../../user/dto/UserResponse";

export default interface AppleUserResponse {
  newUser?: DefaultUserResponse | DataBaseUser;
  user?: DefaultUserResponse | DataBaseUser;
  token?: string;
}
