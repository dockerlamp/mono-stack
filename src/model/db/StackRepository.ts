import { Service } from 'typedi';
import { Model, Connection } from 'mongoose';
import * as winston from 'winston';
import * as _ from 'lodash';

import { Logger } from '../../common/logger/Logger';
import { StackRepositoryFactory } from './StackRepositoryFactory';
import { IComponent } from '../../common/stack/interface/IComponent';
import { Component } from '../../common/stack/Component';
import { StackSchema } from './StackSchema';

export const COMPONENT_COLLECTION = 'component';

@Service({ factory: [StackRepositoryFactory, 'create']})
export class StackRepository {
    private model;

    constructor(private connection: Connection) {
        this.model = connection.model(COMPONENT_COLLECTION, StackSchema, COMPONENT_COLLECTION);
    }

    public async insertOrUpdate(component: IComponent): Promise<IComponent> {
        for (let element of component.walk()) {
            delete element.parent;
        }
        let query = await this.model.findOneAndUpdate({id: component.id},
            component, {upsert: true, new: true});
        return this.toComponent(query);
    }

    public async getById(id: string): Promise<IComponent> {
        let query = await this.model.findOne({id});
        return this.toComponent(query);
    }

    public async getByUserId(id: string): Promise<IComponent[]> {
        let query = await this.model.find({userId: id});
        let components = _.map(query, (value) => this.toComponent(value));
        return components;
    }

    public async delete(component: IComponent): Promise<string> {
        let query = await this.model.deleteOne({id: component.id});
        if (query.n === 0) {
            throw new Error(`component ${component.id} does not exist`);
        }
        return component.id;
    }

    private toComponent(query): IComponent {
        return new Component(query.toObject());
    }
}