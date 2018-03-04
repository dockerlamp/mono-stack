// var _ = require('lodash');
import * as cqrsDomain from 'cqrs-domain';

export default [
    cqrsDomain.defineAggregate({
        name: 'person',
    }, {
        emails: ['default@mycomp.org'],
        phoneNumbers: [],
    }).defineSnapshotNeed((loadingTime, events, aggregate) => {
        return events.length >= 20;
    }),

    cqrsDomain.defineCommand({
        name: 'enterNewPerson',
        payload: 'payload',
    },
    (data, aggregate) => {
        aggregate.apply('enteredNewPerson', data);
    }),

    cqrsDomain.defineCommand({
        name: 'unregisterAllContactInformation',
    }, (cmd, aggregate) => {
        // _.each(aggregate.get('phoneNumbers'), function (number) {
        //     aggregate.apply('unregisteredPhoneNumber', {
        //         number: number
        //     });
        // });
        // _.each(aggregate.get('emails'), function (mail) {
        //     aggregate.apply('unregisteredEMailAddress', {
        //         email: mail
        //     });
        // });
    }),
    cqrsDomain.defineEvent({
        name: 'enteredNewPerson',
        payload: 'payload',
    }, (data, aggregate) => {
        aggregate.set('firstname', data.firstname);
        aggregate.set('lastname', data.lastname);
        aggregate.get('emails').push(data.email);
    }),

    cqrsDomain.defineEvent({
        name: 'unregisteredEMailAddress',
        payload: 'payload',
    }, (data, aggregate) => {
        // aggregate.set('emails', _.without(aggregate.get('emails'), data.email));
    }),

    cqrsDomain.defineEvent({
        name: 'unregisteredPhoneNumber',
    }, (cmd, aggregate) => {
        // aggregate.set('phoneNumbers', _.without(aggregate.get('phoneNumbers'), cmd.payload.number));
    }),

];
