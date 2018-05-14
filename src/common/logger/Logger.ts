import { Container } from 'typedi';
import * as winston from 'winston';

import { LoggerFactory } from './LoggerFactory';

export function Logger() {
    return (object: {}, propertyName: string, index?: number) => {
        const loggerFactory = Container.get(LoggerFactory);
        const logger = loggerFactory.create();
        Container.registerHandler({ object, propertyName, index, value: (containerInstance) => logger });
    };
}
