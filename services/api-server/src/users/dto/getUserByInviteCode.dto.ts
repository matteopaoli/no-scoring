import { IsNotEmpty, IsString } from "class-validator";

export class GetUserByInviteCodeDTO {
  @IsString()
  @IsNotEmpty()
  inviteCode: string;
}