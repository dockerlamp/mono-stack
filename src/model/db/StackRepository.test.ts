import {} from 'jest';
import * as _ from 'lodash';

import { getTestDbContainer } from '../../../test/integration/helpers/getTestDbContainer';
import { StackRepository } from './StackRepository';
import { MongoConnection } from '../../../src/model/db/MongoConnection';
import { StackRepositoryFactory } from './StackRepositoryFactory';
import { Component } from '../../common/stack/Component';
import { ComponentType } from '../../common/stack/interface/ComponentType';
import { removeParents } from '../../../test/integration/helpers/removeParents';
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

    let compare = (firstComponent, secondComponent) => {
        // eliminate circular references for compare
        removeParents(firstComponent);
        removeParents(secondComponent);
        // eliminate specific attribues added by mongoose for compare
        let attributes = ['__v', '_id', '$setOnInsert'];

        expect(_.omit(firstComponent, attributes)).toMatchObject(
            _.omit(secondComponent, attributes));
        expect(_.omit(secondComponent, attributes)).toMatchObject(
            _.omit(firstComponent, attributes));
    };

    it('should insert component', async () => {
        let componentBeforeInsert = _.cloneDeep(component);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toBeUndefined();
        let componentAfterInsert = await stackRepository.insertOrUpdate(componentBeforeInsert);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(1);
        compare(componentBeforeInsert, componentAfterInsert);
    });

    it('should get inserted component by id', async () => {
        let componentBeforeInsert = _.cloneDeep(component);
        await stackRepository.insertOrUpdate(componentBeforeInsert);
        let componentAfterInsert = await stackRepository.getById(componentBeforeInsert.id);
        compare(componentBeforeInsert, componentAfterInsert);
    });

    it('should update inserted component', async () => {
        let componentBeforeInsert = _.cloneDeep(component);
        let componentAfterInsert = await stackRepository.insertOrUpdate(componentBeforeInsert);

        componentAfterInsert.customValue = 'customValue'; // new property
        componentAfterInsert.children[0].type = ComponentType.Stack; // change propery

        let componentAfterUpdate = await stackRepository.insertOrUpdate(componentAfterInsert);
        compare(componentAfterInsert, componentAfterUpdate);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(1);
    });

    it('should handle multiple insertion of the same component', async () => {
        let componentBeforeInsert = _.cloneDeep(component);
        let componentAfterInsert = await stackRepository.insertOrUpdate(componentBeforeInsert);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(1);

        let componentAfterSecondInsert = await stackRepository.insertOrUpdate(componentAfterInsert);
        expect(await connection.collection(COMPONENT_COLLECTION).count({})).toEqual(1);

        compare(componentBeforeInsert, componentAfterSecondInsert);
    });
});
