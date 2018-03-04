import * as cqrsDomain from 'cqrs-domain';
import * as path from 'path';

let domain = cqrsDomain({
    domainPath: path.join(__dirname, './domain'),
});

domain.init((err, warnings) => {
    if (err) {
        console.log('----ERROR: ', err);
        return; // --->>>
    }
    if (warnings) {
        console.warn('----WARNINGS: ', warnings);
    }
    let info = domain.getInfo();
    console.log(JSON.stringify(info, null, 4));
});