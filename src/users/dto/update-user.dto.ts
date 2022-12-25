import { PartialType } from "@nestjs/swagger/dist";

import { SignupDto } from "../../auth/dto/signup.dto";

export class UpdateUserDto extends PartialType(SignupDto) {
}