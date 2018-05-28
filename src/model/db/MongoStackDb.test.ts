import {} from 'jest';
import * as _ from 'lodash';

import { getTestDbContainer } from '../../../test/integration/helpers/getTestDbContainer';
import { MongoStackDb } from './MongoStackDb';
import { MongoConnection } from '../../../src/model/db/MongoConnection';
import { MongoStackDbFactory } from './MongoStackDbFactory';
import { Component } from '../../common/stack/Component';
import { ComponentType } from '../../common/stack/interface/ComponentType';
import { componentsEqual } from '../../../test/integration/helpers/componentsEqual';

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
        expect(componentsEqual(dbComponent, component)).toBeTruthy();
    });

    it('should get component by id', async () => {
        await mongoStackDb.insertOrUpdateComponent(component);
        let dbComponent = await mongoStackDb.getComponentById(component.id);
        expect(componentsEqual(dbComponent, component)).toBeTruthy();
    });

    it('should update existing component', async () => {
        await mongoStackDb.insertOrUpdateComponent(component);
        component.customValue = 'customValue'; // new property
        component.children[0].type = exampleType; // change propery
        let updatedDbComponent = await mongoStackDb.insertOrUpdateComponent(component);
        expect(componentsEqual(updatedDbComponent, component)).toBeTruthy();
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(1);
    });
});
