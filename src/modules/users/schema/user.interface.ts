import { Role } from 'src/common/guards/roles.enum';

export interface User {
  userId: string;
  username: string;
  password?: string;
  role: Role;
}
