import { User } from '../../db/tables/auth/users';
import { UserRepository } from '../repository';

export class UserService {
    static async getSelf(userId: string): Promise<User | null> {
        return await UserRepository.getOneBy({ id: userId });
    }

    static async getAll(): Promise<User[]> {
        return await UserRepository.getAll();
    }
}
