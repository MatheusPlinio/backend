import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

const EXPIRE_TIME = 3 * 60 * 60 * 1000;

@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService,
        private prisma: PrismaService
    ) { }

    async login(email: string, password: string) {
        const account = await this.validateCredentials(email, password);

        const payload = this.createPayload(account);

        return {
            accessToken: await this.jwtService.signAsync(payload, {
                expiresIn: '2h',
                secret: process.env.NEST_PASSPORT_SECRET
            }),
            refreshToken: await this.jwtService.signAsync(payload, {
                expiresIn: '3h',
                secret: process.env.NEST_PASSPORT_REFRESH_SECRET
            }),
            expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
        };
    }

    async refreshToken(user: any) {
        if (!user) {
            throw new Error('Invalid user data');
        }

        const payload = this.createPayloadFromDecodedToken(user);

        return {
            accessToken: await this.jwtService.signAsync(payload, {
                expiresIn: '2h',
                secret: process.env.NEST_PASSPORT_SECRET
            }),
            refreshToken: await this.jwtService.signAsync(payload, {
                expiresIn: '3h',
                secret: process.env.NEST_PASSPORT_REFRESH_SECRET
            }),
            expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
        };
    }

    private createPayload(account: any) {
        const roles = account.user.roles.map(role => role.role.name);

        const address = account.user.address[0] || {}; // Assuming only one address for simplicity
        const { address: addressLine, cep, locality_city, state, country, celphone } = address;

        return {
            email: account.email,
            username: account.user.name,
            role: roles,
            gender: account.user.gender,
            birthday: account.user.birthday,
            cpf: account.user.cpf,
            address: addressLine || '',
            cep: cep || '',
            locality_city: locality_city || '',
            state: state || '',
            country: country || '',
            celphone: celphone || ''
        };
    }

    private createPayloadFromDecodedToken(decodedToken: any) {
        return {
            email: decodedToken.email,
            username: decodedToken.username,
            role: decodedToken.role,
            gender: decodedToken.gender,
            birthday: decodedToken.birthday,
            cpf: decodedToken.cpf,
            address: decodedToken.address,
            cep: decodedToken.cep,
            locality_city: decodedToken.locality_city,
            state: decodedToken.state,
            country: decodedToken.country,
            celphone: decodedToken.celphone
        };
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
        });

        const account = accounts.find(u => u.email === email && bcrypt.compareSync(password, u.password));

        if (!account) {
            throw new Error('User not found');
        }

        return account;
    }
}
