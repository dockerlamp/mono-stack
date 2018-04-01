import { UserReadModel } from '../read-model/UserReadModel';

export class GetSessionUser {
    constructor(private readModel: UserReadModel) {
    }

    public async query(sessionId: string): Promise<any> {
        return await this.readModel.getUserBySessionId(sessionId);
    }
}