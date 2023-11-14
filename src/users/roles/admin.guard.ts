import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { Role } from 'src/users/roles/role.enum';

//Used with JWT guard to allow only admin access to endpoint.
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(@Inject(UsersService) private usersService: UsersService) {}

  /**
   * This function checks if the user making the request is an admin.
   * @param {ExecutionContext} context - The `context` parameter is an instance of `ExecutionContext`,
   * which provides access to information about the current execution context, such as the current HTTP
   * request and response objects. In this case, the `canActivate` method is being used as a guard for a
   * route in a NestJS application, and the
   * @returns A boolean value indicating whether the user is an admin or not.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId: number = request.user.id;
    const user = await this.usersService.findUserById(userId);

    // This returns true if there is a user and
    // the user is an admin
    return user && user.role === Role.Admin;
  }
}
