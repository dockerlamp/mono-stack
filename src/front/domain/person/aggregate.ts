import * as cqrsDomain from 'cqrs-domain';

export default cqrsDomain.defineAggregate({
    name: 'person',
}, {
    emails: [],
    phoneNumbers: [],
}).defineSnapshotNeed((loadingTime, events, aggregate) => {
    console.log('defineSnapshotNeed', loadingTime);
    return events.length >= 20;
});
