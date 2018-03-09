import * as _ from 'lodash';
import * as cqrsDomain from 'cqrs-domain';

const dbg = (input: any) => {
    return JSON.stringify(input, null, 4);
};

export default [
    cqrsDomain.defineCommand({
        name: 'addPersonEmail',
        payload: 'payload',
    },
    (data, aggregate) => {
        console.log('command called', 'addPersonEmail', dbg(data));
        aggregate.apply('addedPersonEmail', data);
        console.log('aggregate after apply', 'addPersonEmail', dbg(aggregate));
    }),

    cqrsDomain.defineEvent({
        name: 'addedPersonEmail',
        payload: 'payload',
    }, (data, aggregate) => {
        console.log('event called', 'addedPersonEmail', dbg(data));
        if (data.email) {
            aggregate.get('emails').push(data.email);
        }
    }),
];
