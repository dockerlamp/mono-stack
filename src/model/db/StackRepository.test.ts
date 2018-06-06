import {} from 'jest';
import * as _ from 'lodash';

import { getTestDbContainer } from '../../../test/integration/helpers/getTestDbContainer';
import { StackRepository } from './StackRepository';
import { MongoConnection } from '../../../src/model/db/MongoConnection';
import { StackRepositoryFactory } from './StackRepositoryFactory';
import { Component } from '../../common/stack/Component';
import { ComponentType } from '../../common/stack/interface/ComponentType';
import { compareComponent } from '../../../test/integration/helpers/compareComponent';
import { COMPONENT_COLLECTION } from '../../../src/model/db/StackRepository';
import { UserModel } from '../user/model/UserModel';

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
        testDbContainer.get(UserModel); // init model for stack repository
        testDbContainer.reset();
    });

    beforeEach(async () => {
        await connection.collection(COMPONENT_COLLECTION).deleteMany({});
    });

    afterEach(async () => {
        await connection.collection(COMPONENT_COLLECTION).deleteMany({});
    });

    it('should insert component', async () => {
        let componentBeforeInsert = _.cloneDeep(component);
        let componentAfterInsert = await stackRepository.insertOrUpdate(componentBeforeInsert);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(1);
        compareComponent(componentBeforeInsert, componentAfterInsert);
    });

    it('should get inserted component by id', async () => {
        let componentBeforeInsert = _.cloneDeep(component);
        await stackRepository.insertOrUpdate(componentBeforeInsert);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(1);
        let componentAfterInsert = await stackRepository.getById(componentBeforeInsert.id);
        compareComponent(componentBeforeInsert, componentAfterInsert);
    });

    it('should update inserted component', async () => {
        let componentBeforeInsert = _.cloneDeep(component);
        let componentAfterInsert = await stackRepository.insertOrUpdate(componentBeforeInsert);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(1);
        componentAfterInsert.customValue = 'customValue'; // new property
        componentAfterInsert.children[0].type = ComponentType.Stack; // change propery
        let componentAfterUpdate = await stackRepository.insertOrUpdate(componentAfterInsert);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(1);
        compareComponent(componentAfterInsert, componentAfterUpdate);
    });

    it('should handle multiple insertion of the same component', async () => {
        let componentBeforeInsert = _.cloneDeep(component);
        let componentAfterInsert = await stackRepository.insertOrUpdate(componentBeforeInsert);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(1);
        let componentAfterSecondInsert = await stackRepository.insertOrUpdate(componentAfterInsert);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(1);
        compareComponent(componentBeforeInsert, componentAfterSecondInsert);
    });

    it('should delete added component', async () => {
        let clonedComponent = _.cloneDeep(component);
        let componentAfterInsert = await stackRepository.insertOrUpdate(clonedComponent);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(1);
        let deletedComponentId = await stackRepository.delete(componentAfterInsert);
        expect(deletedComponentId).toEqual(componentAfterInsert.id);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(0);
    });

    it('should raise error when deleting not existing component', async () => {
        let clonedComponent = _.cloneDeep(component);
        await expect(stackRepository.delete(clonedComponent)).rejects.toBeInstanceOf(Error);
    });
});
