import { Service } from 'typedi';

import { UserModel } from '../model/UserModel';

@Service()
export class GetProviderUser {
    constructor(private userModel: UserModel) {
    }

    // @TODO missing return type
    public async query(provider: string, providerUserId: string): Promise<any> {
        return await this.userModel.getUserByProvider(provider, providerUserId);
    }
}