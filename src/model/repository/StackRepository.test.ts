import {} from 'jest';

import { getTestDbContainer } from '../../../test/integration/helpers/getTestDbContainer';
import { Stack } from '../../common/stack/Stack';
import { ComponentType } from '../../common/stack/interface/ComponentType';
import { MongoStackDbFactory } from '../../model/db/MongoStackDbFactory';
import { StackRepository } from '../../model/repository/StackRepository';

import { IComponent } from '../../common/stack/interface/IComponent';

const exampleType = ComponentType.Stack;
const exampleType2 = ComponentType.Service;
export const COMPONENT_COLLECTION = 'component';

describe('StackRepository', () => {
    let testDbContainer;
    let stackRepository: StackRepository;
    let connection;

    let stack = new Stack({
        type: exampleType,
        children: [
            new Stack({
                type: exampleType2,
            }),
        ],
    });

    // @TODO make as helper (used in MongoStackDb too)
    let expectDbComponentEqualsComponent = (dbComponent: IComponent, component: IComponent) => {
        let serializedDbComponentJsonString = JSON.stringify(dbComponent, Object.keys(dbComponent).sort());
        let serializedComponentJsonString = JSON.stringify(component, Object.keys(component).sort());
        expect(serializedDbComponentJsonString).toEqual(serializedComponentJsonString);
    };

    beforeAll(async () => {
        testDbContainer = getTestDbContainer();
        stackRepository = testDbContainer.get(StackRepository);
        testDbContainer.reset();
    });

    it('should insert stack', async () => {
        // @TODO how to test Promise<void>?
        stackRepository.add(stack);
    });

    it('should get stack by id', async () => {
        await stackRepository.add(stack);
        let repoStack = await stackRepository.findbyId(stack.id);
        expectDbComponentEqualsComponent(repoStack, stack);
    });
});