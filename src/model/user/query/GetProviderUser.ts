import { Service } from 'typedi';

import { UserService } from '../service/UserService';

@Service()
export class GetProviderUser {
    constructor(private userService: UserService) {
    }

    // @TODO missing return type
    public async query(provider: string, providerUserId: string): Promise<any> {
        return await this.userService.getUserByProvider(provider, providerUserId);
    }
}