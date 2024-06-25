import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshJwtGuard } from './refresh.guard';
// import { JwtGuard } from './jwt.guard';
// import { Role } from '../role.decorator';
// import { RoleGuard } from '../role/role.guard';

@Controller()
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() body) {
        return { token: await this.authService.login(body.email, body.password) };
    }

    @UseGuards(RefreshJwtGuard)
    @Post('refresh_tokens')
    async refreshToken(@Request() req){
        return await this.authService.refreshToken(req.user)
    }
    // exemplo
    // @Role('admin')
    // @UseGuards(JwtGuard, RoleGuard)
    // @Get('testjwt')
    // testjwt() {
    //     return {
    //         name: 'Asshole'
    //     }
    // }
}
