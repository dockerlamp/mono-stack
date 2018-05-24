import {} from 'jest';
import * as _ from 'lodash';

import { getTestDbContainer } from '../../../test/integration/helpers/getTestDbContainer';
import { MongoController } from './MongoController';
import { MongoConnection } from '../../../src/model/db/MongoConnection';
import { MongoControllerFactory } from './MongoControllerFactory';
import { IComponent } from '../../common/stack/interface/IComponent';
import { Component } from '../../common/stack/Component';
import { ComponentType } from '../../common/stack/interface/ComponentType';

const exampleType = ComponentType.Stack;
const exampleType2 = ComponentType.Service;
export const COMPONENT_COLLECTION = 'component';

describe('MongoController', () => {
    let mongoController: MongoController;
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
        dbComponent = dbComponent.toObject();
        dbComponent = _.omit(dbComponent, ['_id', '__v']);
        let serializedDbComponentJsonString = JSON.stringify(dbComponent, Object.keys(dbComponent).sort());
        let serializedComponentJsonString = JSON.stringify(component, Object.keys(component).sort());
        expect(serializedDbComponentJsonString).toBe(serializedComponentJsonString);
    };

    beforeAll(async () => {
        testDbContainer = getTestDbContainer();
        connection = testDbContainer.get(MongoConnection).getConnection();
        mongoController = testDbContainer.get(MongoControllerFactory).create();
        testDbContainer.reset();
    });

    beforeEach(async () => {
        await connection.collection(COMPONENT_COLLECTION).deleteMany({});
    });

    afterEach(async () => {
        await connection.collection(COMPONENT_COLLECTION).deleteMany({});
    });

    it('should insert component', async () => {
        let dbComponent = await mongoController.insertComponent(component);
        expectDbComponentEqualsComponent(dbComponent, component);
    });

    it('should get component by id', async () => {
        await mongoController.insertComponent(component);
        let dbComponent = await mongoController.getComponentById(component.id);
        expectDbComponentEqualsComponent(dbComponent, component);
    });

    it('should update existing component', async () => {
        await mongoController.insertComponent(component);
        component.customValue = 'customValue'; // new property
        component.children[0].type = exampleType; // change propery
        let updatedDbComponent = await mongoController.insertComponent(component);
        expectDbComponentEqualsComponent(updatedDbComponent, component);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(1);

    });
});
