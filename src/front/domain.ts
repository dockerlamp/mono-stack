import * as cqrsDomain from 'cqrs-domain';

let domain = cqrsDomain({
    domainPath: './domain',
});

domain.init((err, warnings) => {
    console.log(err, warnings);
});