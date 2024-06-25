import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshJwtGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers['authorization']?.split(' ')[1];

        if (!token) {
            return false;
        }

        try {
            const decoded = this.jwtService.verify(token, { secret: process.env.NEST_PASSPORT_REFRESH_SECRET });
            request.user = decoded;
            return true;
        } catch (e) {
            return false;
        }
    }
}
