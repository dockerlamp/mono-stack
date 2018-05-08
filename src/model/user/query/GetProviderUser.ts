import { Service } from 'typedi';

import { UserReadModel } from '../read-model/UserReadModel';

@Service()
export class GetProviderUser {
    constructor(private readModel: UserReadModel) {
    }

    // @TODO missing return type
    public async query(provider: string, providerUserId: string): Promise<any> {
        return await this.readModel.getUserByProvider(provider, providerUserId);
    }
}