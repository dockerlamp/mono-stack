import { Container } from 'typedi';
import * as winston from 'winston';

import { LoggerProxy } from './LoggerProxy';

export function Logger() {
    return (object: {}, propertyName: string, index?: number) => {
        const loggerProxy = Container.get(LoggerProxy);
        const logger = loggerProxy.getLogger();
        Container.registerHandler({ object, propertyName, index, value: (containerInstance) => logger });
    };
}
