import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { PrismaService } from 'src/prisma/prisma/prisma.service';
@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService,
        private prisma: PrismaService) { }

    async login(email: string, password: string) {
        const account = await this.validateCredentials(email, password)

        const roles = account.user.roles.map(role => role.role.name);

        const payload = {
            email: account.email,
            username: account.user.name,
            role: roles,
            gender: account.user.gender,
            address: account.user.address.find(u => u.address),
            cep: account.user.address.find(u => u.cep),
            locality_city: account.user.address.find(u => u.locality_city),
            state: account.user.address.find(u => u.state),
            cellphone: account.user.address.find(u => u.celphone),
        }

        const token = this.jwtService.sign(payload);

        return token;
    }

    async validateCredentials(email: string, password: string) {
        const accounts = await this.prisma.userAccount.findMany({
            include: {
                user: {
                    include: {
                        roles: {
                            include: {
                                role: true
                            }
                        },
                        account: true,
                        address: true
                    }
                }
            }
        })

        const account = accounts.find(u => u.email === email && bcrypt.compareSync(password, u.password))

        if (!account) {
            throw new Error('User not found')
        }

        return account;
    }

}
