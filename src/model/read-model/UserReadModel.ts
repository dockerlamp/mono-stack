import { EventEmitter } from 'events';

/**
 * Create read model using write model events
 */
export class UserReadModel extends EventEmitter {
    private sessions: {[sessioId: string]: any} = {};

    constructor(private userEmitter: EventEmitter) {
        super();
        let updateSessions = (user) => {
            // index users by sessionId
            user.sessionIds.forEach((sessionId) => {
                let prevValue = this.sessions[sessionId];
                this.sessions[sessionId] = user;
                if (prevValue !== user) {
                    this.emit('session-index-updated', sessionId);
                }
            });
        };
        this.userEmitter.on('updated', updateSessions);
        this.userEmitter.on('added', updateSessions);
    }

    public async getUserBySessionId(sessionId: string): Promise<any> {
        return this.sessions[sessionId];
    }

}
