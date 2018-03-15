import { User } from './user';

export class UserRepo {

    private users: User[] = [];

    /** add user if not exists in repo */
    public addUser(provider: string, userProfile: any) {

        if (provider === 'github') {
            let userExists = false;
            this.users.forEach( (user) => {
                if (userProfile.id === user.externalId[provider]) {
                    userExists = true;
                }
            });

            if (!userExists) {
                let newUser = new User();
                // TODO review and incorporate all user profile data
                newUser.externalId[provider] = userProfile.id;
                newUser.firstName = userProfile.username;
                this.users.push(newUser);
            }
        }
    }

    public getUser(provider: string, providerId: any) {

        let gotUser: User;
        this.users.forEach( (user) => {
            if (provider === 'github' && user.externalId[provider] === providerId) {
                gotUser = user;
            }
        });
        return gotUser;
    }

    public repoStats() {

        return 'Users in repo: ' + this.users.length;
    }
}
