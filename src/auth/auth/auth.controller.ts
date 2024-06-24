import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
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

    @Get('teste')
    teste() {
        const hello = "hello"
        return hello
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
