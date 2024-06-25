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

        const address = account.user.address[0]?.address || ''; // Assuming only one address for simplicity
        const cep = account.user.address[0]?.cep || '';
        const locality_city = account.user.address[0]?.locality_city || '';
        const state = account.user.address[0]?.state || '';
        const celphone = account.user.address[0]?.celphone || '';

        const payload = {
            email: account.email,
            username: account.user.name,
            role: roles,
            gender: account.user.gender,
            address: address,
            cep: cep,
            locality_city: locality_city,
            state: state,
            celphone: celphone,
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
