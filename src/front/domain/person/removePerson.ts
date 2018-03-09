import * as _ from 'lodash';
import * as cqrsDomain from 'cqrs-domain';

const dbg = (input: any) => {
    return JSON.stringify(input, null, 4);
};

export default [
    cqrsDomain.defineCommand({
        name: 'removePerson',
        payload: 'payload',
    },
    (data, aggregate) => {
        console.log('command called', 'removePerson', dbg(data));
        aggregate.apply('removedPerson', data);
        console.log('aggregate after apply', 'removePerson', dbg(aggregate));
    }),

    cqrsDomain.defineEvent({
        name: 'removedPerson',
        payload: 'payload',
    }, (data, aggregate) => {
        console.log('event called', 'removedPerson', dbg(data));
        aggregate.destroy();
    }),
];

