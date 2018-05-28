import {} from 'jest';
import * as _ from 'lodash';

import { getTestDbContainer } from '../../../test/integration/helpers/getTestDbContainer';
import { MongoStackDb } from './MongoStackDb';
import { MongoConnection } from '../../../src/model/db/MongoConnection';
import { MongoStackDbFactory } from './MongoStackDbFactory';
import { IComponent } from '../../common/stack/interface/IComponent';
import { Component } from '../../common/stack/Component';
import { ComponentType } from '../../common/stack/interface/ComponentType';

const exampleType = ComponentType.Stack;
const exampleType2 = ComponentType.Service;
export const COMPONENT_COLLECTION = 'component';

describe('MongoStackDb', () => {
    let mongoStackDb: MongoStackDb;
    let testDbContainer;
    let connection;

    let component = new Component({
        type: exampleType,
        children: [
            new Component({
                type: exampleType2,
            }),
        ],
    });

    let expectDbComponentEqualsComponent = (dbComponent: IComponent, component: IComponent) => {
        let serializedDbComponentJsonString = JSON.stringify(dbComponent, Object.keys(dbComponent).sort());
        let serializedComponentJsonString = JSON.stringify(component, Object.keys(component).sort());
        expect(serializedDbComponentJsonString).toBe(serializedComponentJsonString);
    };

    beforeAll(async () => {
        testDbContainer = getTestDbContainer();
        connection = testDbContainer.get(MongoConnection).getConnection();
        mongoStackDb = testDbContainer.get(MongoStackDbFactory).create();
        testDbContainer.reset();
    });

    beforeEach(async () => {
        await connection.collection(COMPONENT_COLLECTION).deleteMany({});
    });

    afterEach(async () => {
        await connection.collection(COMPONENT_COLLECTION).deleteMany({});
    });

    it('should insert component', async () => {
        let dbComponent = await mongoStackDb.insertOrUpdateComponent(component);
        expectDbComponentEqualsComponent(dbComponent, component);
    });

    it('should get component by id', async () => {
        await mongoStackDb.insertOrUpdateComponent(component);
        let dbComponent = await mongoStackDb.getComponentById(component.id);
        expectDbComponentEqualsComponent(dbComponent, component);
    });

    it('should update existing component', async () => {
        await mongoStackDb.insertOrUpdateComponent(component);
        component.customValue = 'customValue'; // new property
        component.children[0].type = exampleType; // change propery
        let updatedDbComponent = await mongoStackDb.insertOrUpdateComponent(component);
        expectDbComponentEqualsComponent(updatedDbComponent, component);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(1);
    });
});
