import { Stack } from './Stack';
import { ComponentType } from './interface/ComponentType';

describe('Stack', () => {
    it('instance should have valid type', () => {
        let stack = new Stack();
        expect(stack.type).toBe(ComponentType.Stack);
    });
});