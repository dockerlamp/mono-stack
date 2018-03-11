import { EventEmitter } from 'events';

export class UserReadModel {
    private sessions: {[sessioId: string]: any} = {};

    constructor( private userEmitter: EventEmitter) {

        let updateSessions = (user) => {
            user.sessionIds.forEach((sessionId) => {
                this.sessions[sessionId] = user;
            });
        };
        this.userEmitter.on('updated', updateSessions);
        this.userEmitter.on('added', updateSessions);
    }

    public async getUserBySessionId(sessionId: string): Promise<any> {
        return this.sessions[sessionId];
    }

}
