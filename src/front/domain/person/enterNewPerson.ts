import * as _ from 'lodash';
import * as cqrsDomain from 'cqrs-domain';

const dbg = (input: any) => {
    return JSON.stringify(input, null, 4);
};

export default [
    cqrsDomain.defineCommand({
        name: 'enterNewPerson',
        payload: 'payload',
    },
    (data, aggregate) => {
        console.log('command called', 'enterNewPerson', dbg(data));
        aggregate.apply('enteredNewPerson', data);
        console.log('aggregate after apply', 'enterNewPerson', dbg(aggregate));
    }),

    cqrsDomain.defineEvent({
        name: 'enteredNewPerson',
        payload: 'payload',
    }, (data, aggregate) => {
        console.log('event called', 'enteredNewPerson', dbg(data));
        aggregate.set('firstname', data.firstname);
        aggregate.set('lastname', data.lastname);
        if (data.email) {
            aggregate.get('emails').push(data.email);
        }
    }),

    // cqrsDomain.defineCommand({
    //     name: 'unregisterAllContactInformation',
    // }, (cmd, aggregate) => {
    //     _.each(aggregate.get('phoneNumbers'), (phoneNumber) => {
    //         aggregate.apply('unregisteredPhoneNumber', {
    //             number: phoneNumber
    //         });
    //     });
    //     _.each(aggregate.get('emails'), (mail) => {
    //         aggregate.apply('unregisteredEMailAddress', {
    //             email: mail
    //         });
    //     });
    // }),

    // cqrsDomain.defineEvent({
    //     name: 'unregisteredEMailAddress',
    //     payload: 'payload',
    // }, (data, aggregate) => {
    //     aggregate.set('emails', _.without(aggregate.get('emails'), data.email));
    // }),

    // cqrsDomain.defineEvent({
    //     name: 'unregisteredPhoneNumber',
    // }, (cmd, aggregate) => {
    //     aggregate.set('phoneNumbers', _.without(aggregate.get('phoneNumbers'), cmd.payload.number));
    // }),

];
