import * as _ from 'lodash';
import * as uuid from 'uuid';
import { EventEmitter } from 'events';

export class UserWriteModel extends EventEmitter {
    private users = [];

    public async saveUser(userData: any): Promise<string> {
        let user = await this.getUserByEmail(userData.email);
        if (user) {
            await this.updateUser(user.id, userData);
            return user.id;
        } else {
            let id = await this.addUser(userData);
            return id;
        }

    }

    protected async updateUser(id: string, userData: any) {
        let user = await this.getUserById(id);
        user.userName = userData.userName;
        user.sessionIds.push(userData.sessionId);
        user.sessionIds = _.uniq(user.sessionIds);
        this.emit('updated', user);
    }

    protected async addUser(userData: any): Promise<string> {
        let id = uuid.v4();
        let user = {
            id: id,
            email: userData.email,
            userName: userData.userName,
            sessionIds: [ userData.sessionId ]
        };
        this.users.push(user);
        this.emit('added', user);

        return id;
    }

    protected async getUserByEmail(email: string): Promise<any> {
        return _.find(this.users, {email});
    }

    protected async getUserById(id: string): Promise<any> {
        return _.find(this.users, {id});
    }

}