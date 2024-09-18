import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '../../../common/guards/roles.enum';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
