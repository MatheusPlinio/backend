import { Body, Controller, Post } from '@nestjs/common';
import { RegisterService } from './register.service';
import { TRegisterUser } from 'src/types/auth/register/register-user.type';

@Controller()
export class RegisterController {

    constructor(private registerUser: RegisterService) { }

    @Post('register')
    async register(@Body() registerUserDto: TRegisterUser) {
        return { token: await this.registerUser.register(registerUserDto) }
    }
}
