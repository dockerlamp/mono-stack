import { Service } from 'typedi';
import { Model, Connection, Query } from 'mongoose';
import * as winston from 'winston';
import * as _ from 'lodash';

import { Logger } from '../../common/logger/Logger';
import { MongoStackDbFactory } from './MongoStackDbFactory';
import { IStackDb } from './IStackDb';
import { IComponent } from '../../common/stack/interface/IComponent';
import { ComponentSchema } from './ComponentSchema';

export const COMPONENT_COLLECTION = 'component';

@Service({ factory: [MongoStackDbFactory, 'create']})
export class MongoStackDb implements IStackDb {
    private model;

    constructor(
        private connection: Connection,
        @Logger() private logger: winston.Logger
     ) {
        this.model = connection.model(COMPONENT_COLLECTION, ComponentSchema, COMPONENT_COLLECTION);
    }

    public async insertOrUpdateComponent(component: IComponent): Promise<IComponent> {
        let serializedComponent = JSON.stringify(component);
        let serializedComponentObject = JSON.parse(serializedComponent);
        let query = await this.model.findOneAndUpdate({id: component.id},
            serializedComponentObject, {upsert: true, new: true});
        return this.mongooseQueryToObject(query);
    }

    public async getComponentById(id: string): Promise<IComponent> {
        let query = await this.model.findOne({id: id});
        return this.mongooseQueryToObject(query);
    }

    private mongooseQueryToObject(query: Query<any>): object {
        let queryAsObject = query.toObject();
        return _.omit(queryAsObject, ['_id', '__v']);
    }
}