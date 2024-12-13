import { IsPhoneNumber, IsString, IsUUID } from 'class-validator';

export class AuthenticatedUserDto {
  @IsUUID()
  id!: string;

  @IsString()
  email!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsPhoneNumber()
  phone!: string;
}
