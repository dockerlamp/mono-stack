import {} from 'jest';
import * as _ from 'lodash';

import { getTestDbContainer } from '../../../test/integration/helpers/getTestDbContainer';
import { StackRepository } from './StackRepository';
import { MongoConnection } from '../../../src/model/db/MongoConnection';
import { StackRepositoryFactory } from './StackRepositoryFactory';
import { Component } from '../../common/stack/Component';
import { ComponentType } from '../../common/stack/interface/ComponentType';
import { componentsEqual } from '../../../test/integration/helpers/componentsEqual';
import { COMPONENT_COLLECTION } from '../../../src/model/db/StackRepository';

describe('StackRepository', () => {
    let stackRepository: StackRepository;
    let testDbContainer;
    let connection;

    let component = new Component({
        type: ComponentType.Stack,
        children: [
            new Component({
                type: ComponentType.Service,
            }),
        ],
    });

    beforeAll(async () => {
        testDbContainer = getTestDbContainer();
        connection = testDbContainer.get(MongoConnection).getConnection();
        stackRepository = testDbContainer.get(StackRepositoryFactory).create();
        testDbContainer.reset();
    });

    beforeEach(async () => {
        await connection.collection(COMPONENT_COLLECTION).deleteMany({});
    });

    afterEach(async () => {
        await connection.collection(COMPONENT_COLLECTION).deleteMany({});
    });

    it('should insert component', async () => {
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toBeUndefined();
        let dbComponent = await stackRepository.insertOrUpdate(component);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(1);
        expect(componentsEqual(dbComponent, component)).toBeTruthy();
    });

    it('should get inserted component by id', async () => {
        await stackRepository.insertOrUpdate(component);
        let dbComponent = await stackRepository.getById(component.id);
        expect(componentsEqual(dbComponent, component)).toBeTruthy();
    });

    it('should update existing component', async () => {
        await stackRepository.insertOrUpdate(component);
        component.customValue = 'customValue'; // new property
        component.children[0].type = ComponentType.Stack; // change propery
        let updatedDbComponent = await stackRepository.insertOrUpdate(component);
        expect(componentsEqual(updatedDbComponent, component)).toBeTruthy();
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(1);
    });
});
