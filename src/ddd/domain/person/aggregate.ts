import * as cqrsDomain from 'cqrs-domain';
import { IPerson, IEmail } from './IPerson';

let aggregateDefaults: IPerson = {
    emails: []
};
export default cqrsDomain
    .defineAggregate({
        name: 'person'
    }, aggregateDefaults)
    .defineSnapshotNeed((loadingTime, events, aggregate) => {
        console.log('defineSnapshotNeed', loadingTime);
        return events.length >= 20;
    });
