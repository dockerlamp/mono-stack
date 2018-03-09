import * as cqrsDomain from 'cqrs-domain';
import * as path from 'path';
import * as _ from 'lodash';
import * as jspath from 'jspath';

let domain = cqrsDomain({
    domainPath: path.join(__dirname, './domain'),
});

let addPerson = (person: any, personId?: string) => {
    let command: any = {
        // id: 'b80ade36-dd05-4340-8a8b-846eea6e286f',
        name: 'enterNewPerson',
        payload: person,
    };
    if (personId) {
        command.aggregate = {
            id: personId,
            name: 'person'
        }
    }
    domain.handle(command, (err) => {
        if (err) {
            console.log('----HANDLE ERROR: ', err);
            return; // --->>>
        }
    });
};

let addEmail = (email: string, personId: string) => {
    let command: any = {
        name: 'addPersonEmail',
        payload: {
            email
        },
        aggregate: {
            id: personId,
            name: 'person'
        },
    };
    domain.handle(command, (err) => {
        if (err) {
            console.log('----HANDLE ERROR: ', err);
            return; // --->>>
        }
    });
};

let removePerson = (personId: string) => {
    let command: any = {
        name: 'removePerson',
        payload: { },
        aggregate: {
            id: personId,
            name: 'person'
        },
    };
    domain.handle(command, (err) => {
        if (err) {
            console.log('----HANDLE ERROR: ', err);
            return; // --->>>
        }
    });
};

domain.init((err, warnings) => {
    if (err) {
        console.log('----INIT ERROR: ', err);
        return; // --->>>
    }
    if (warnings) {
        console.warn('----INIT WARNINGS: ', warnings);
    }
    let info = domain.getInfo();
    console.log(jspath.apply('..*.name', info));
    let person = {
        firstname: _.sample(['Jack', 'John', 'Emil', 'George', 'James']),
        lastname: _.sample(['Huston', 'Doe', 'Brown', 'Red', 'Bond']),
        email: 'asd@gmail.com'
    };
    addPerson(person, '1');
    addEmail('blabla@gmail.com', '1');
    addEmail(null, '1');
    removePerson('1');

    // _.each(_.range(1, 5), (num) => {
    //     addPerson(_.sample(_.range(1, 5)).toString());
    // });
});
