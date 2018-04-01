import * as _ from 'lodash';
import * as uuid from 'uuid';
import { EventEmitter } from 'events';

import { ILoginUser } from '../command/ILoginUser';

interface IProviderIdentifiers {
    [provider: string]: string;
}

interface IWriteModelUser {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    providerIds: IProviderIdentifiers;
    sessionIds: string[];
}

export class UserWriteModel extends EventEmitter {
    private users: IWriteModelUser[] = [];

    public async saveUser(userData: ILoginUser): Promise<string> {
        let user = await this.getUserByProvider(userData.provider, userData.providerUserId);
        if (user) {
            await this.updateUser(user.id, userData);
            return user.id;
        } else {
            let id = await this.addUser(userData);
            return id;
        }

    }

    protected async updateUser(id: string, userData: ILoginUser) {
        let user = await this.getUserById(id);
        user.name = userData.name;
        user.firstName = userData.firstName;
        user.lastName = userData.lastName;
        user.email = userData.email;
        user.providerIds[userData.provider] = userData.providerUserId;
        user.sessionIds.push(userData.sessionId);
        user.sessionIds = _.uniq(user.sessionIds);

        this.emit('updated', user);
    }

    protected async addUser(userData: ILoginUser): Promise<string> {
        let id = uuid.v4();
        let user: IWriteModelUser = {
            id: id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            name: userData.name,
            providerIds: {
                [userData.provider]: userData.providerUserId
            },
            sessionIds: [ userData.sessionId ]
        };
        this.users.push(user);
        this.emit('added', user);

        return id;
    }

    protected async getUserByProvider(provider: string, providerUserId: string): Promise<IWriteModelUser> {
        return _.find(this.users, (user) => {
            return user.providerIds[provider] === providerUserId;
        });
    }

    protected async getUserById(id: string): Promise<IWriteModelUser> {
        return _.find(this.users, {id});
    }

}