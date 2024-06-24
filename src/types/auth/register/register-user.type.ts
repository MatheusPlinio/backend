import { UserAccount, UserAddress, Users } from "@prisma/client";

export interface TRegisterUser extends Users {
    account: UserAccount
    role: bigint
    address: UserAddress
}