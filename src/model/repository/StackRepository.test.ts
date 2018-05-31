import {} from 'jest';

import { getTestDbContainer } from '../../../test/integration/helpers/getTestDbContainer';
import { Stack } from '../../common/stack/Stack';
import { ComponentType } from '../../common/stack/interface/ComponentType';
import { MongoStackDbFactory } from '../../model/db/MongoStackDbFactory';
import { MongoConnection } from '../../../src/model/db/MongoConnection';
import { StackRepository } from '../../model/repository/StackRepository';
import { componentsEqual } from '../../../test/integration/helpers/componentsEqual';
import { IComponent } from '../../common/stack/interface/IComponent';
import { COMPONENT_COLLECTION } from '../../../src/model/db/MongoStackDb';

describe('StackRepository', () => {
    let testDbContainer;
    let stackRepository: StackRepository;
    let connection;

    let stack = new Stack({
        type: ComponentType.Stack,
        children: [
            new Stack({
                type: ComponentType.Service,
            }),
        ],
    });

    beforeAll(async () => {
        testDbContainer = getTestDbContainer();
        connection = testDbContainer.get(MongoConnection).getConnection();
        stackRepository = testDbContainer.get(StackRepository);
        testDbContainer.reset();
    });

    beforeEach(async () => {
        await connection.collection(COMPONENT_COLLECTION).deleteMany({});
    });

    afterEach(async () => {
        await connection.collection(COMPONENT_COLLECTION).deleteMany({});
    });

    it('should insert stack', async () => {
        // @TODO how to test Promise<void>?
        stackRepository.add(stack);
    });

    it('should get stack by id', async () => {
        await stackRepository.add(stack);
        let repoStack = await stackRepository.findbyId(stack.id);
        expect(componentsEqual(repoStack, stack)).toBeTruthy();
    });

    it('should create new stack from stack data', async () => {
        let stackData: IComponent = {
            type: ComponentType.Stack,
            children: [
                {
                    type: ComponentType.Service,
                },
            ],
        };
        let stack = stackRepository.create(stackData);
        expect(stack).toBeInstanceOf(Stack);
    });
});