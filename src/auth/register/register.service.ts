import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { TRegisterUser } from 'src/types/auth/register/register-user.type';
import { BcryptService } from 'src/util/bcrypt/bcrypt.service';

@Injectable()
export class RegisterService {

    constructor(
        private jwtService: JwtService,
        private prisma: PrismaService,
        private bcryptService: BcryptService
    ) { }

    async register(req: TRegisterUser) {

        const password = await this.bcryptService.hashPassword(req.account.password);
        try {
            const createUser = this.prisma.users.create({
                data: {
                    name: req.name,
                    cpf: req.cpf,
                    gender: req.gender,
                    birthday: req.birthday,
                    account: {
                        create: {
                            email: req.account.email,
                            password: password,
                            safe_phrase: req.account.safe_phrase
                        }
                    },
                    address: {
                        create: {
                            address: req.address.address,
                            celphone: req.address.celphone,
                            cep: req.address.cep,
                            locality_city: req.address.locality_city,
                            state: req.address.state,
                            country: req.address.country
                        }
                    }
                },
                include: {
                    account: true,
                    address: true,
                },
            })

            const userRoles = await this.prisma.userRoles.create({
                data: {
                    user_id: (await createUser).id,
                    role_id: req.role
                }
            })

            if (createUser && userRoles) {
                const payload = {
                    email: req.account.email,
                    username: req.name,
                    role: req.role,
                }

                return this.jwtService.sign(payload)
            }

        } catch (error) {
            throw new Error(`Erro ao registrar usuário: ${error.message}`);
        }
    }
}
