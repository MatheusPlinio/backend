import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategyService } from './jwt-strategy/jwt-strategy.service';
import { RegisterController } from './register/register.controller';
import { RegisterService } from './register/register.service';
import { PrismaModule } from 'src/prisma/prisma/prisma.module';
import { BcryptService } from 'src/util/bcrypt/bcrypt.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'abcd123456',
      signOptions: {
        expiresIn: '60s',
      },
    }),
    PrismaModule
  ],
  controllers: [AuthController, RegisterController],
  providers: [AuthService, JwtStrategyService, RegisterService, BcryptService]
})
export class AuthModule { }
