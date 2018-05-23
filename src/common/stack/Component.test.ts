import {} from 'jest';

import { Component } from './Component';
import { ComponentType } from './interface/ComponentType';
import { Stack } from './Stack';
import { IComponent } from './interface/IComponent';

const exampleType = ComponentType.Stack;
const exampleId = 'id';

describe('Component', () => {
    it('should not allow to create untyped component', () => {
        expect(() => {
            let component = new Component({});
        }).toThrow();
    });

    it('should not allow to create typed component', () => {
        let component = new Component({ type: exampleType});
        expect(component.type).toBe(exampleType);
    });

    it('should have id', () => {
        let component = new Component({ type: exampleType});
        expect(component.id).toBeDefined();
    });

    it('should allow to pass own id', () => {
        let component = new Component({ type: exampleType, id: exampleId});
        expect(component.id).toBe(exampleId);
    });

    it('should allow to pass custom fields', () => {
        let initData: IComponent = { type: exampleType, custom: 'custom value'};
        let component = new Component(initData);
        expect(component.custom).toBe(initData.custom);
    });

    it('should create the same component when serialize and deserialize', () => {
        let component = new Component({
            type: exampleType,
            id: exampleId,
            custom: 'customValue',
            children: [
                new Component({type: exampleType}),
            ],
        });
        let serializedComponentJsonString = JSON.stringify(component);
        let serializedComponentJsonObject = JSON.parse(serializedComponentJsonString);
        let unserializedComponent = new Component(serializedComponentJsonObject);

        expect(unserializedComponent.id).toBe(component.id);
        expect(unserializedComponent.type).toBe(component.type);
        expect(unserializedComponent.custom).toBe(component.custom);
        expect(unserializedComponent.children).toHaveLength(component.children.length);
    });

    it('should serialize without parent', () => {
        let component = new Component({
            type: exampleType,
            children: [
                new Component({type: exampleType}),
            ],
        });
        let serializedComponentJsonString = JSON.stringify(component);
        let serializedComponentJsonObject = JSON.parse(serializedComponentJsonString);

        expect(serializedComponentJsonObject.parent).toBeUndefined();
        expect(serializedComponentJsonObject.children[0].parent).toBeUndefined();
    });

    it('should allow to initialize with children components', () => {
        let initData: IComponent = {
            type: exampleType,
            id: exampleId,
            children: [
                new Component({type: exampleType}),
            ],
        };
        let stack = new Component(initData);
        expect(stack.children).toHaveLength(initData.children.length);
        expect(stack.children[0].type).toBe(initData.children[0].type);
        expect(stack.children[0].id).toBe(initData.children[0].id);
    });

    it('should allow to initialize with children components passed as plain object', () => {
        let initData: IComponent = {
            type: exampleType,
            id: exampleId,
            children: [
                {type: exampleType, id: exampleId},
            ],
        };
        let component = new Component(initData);
        expect(component.children).toHaveLength(initData.children.length);
        expect(component.children[0].type).toBe(initData.children[0].type);
        expect(component.children[0].id).toBe(initData.children[0].id);
    });

    it('should disallow to initialize with children components passed as plain object without type', () => {
        let initData: IComponent = {
            type: exampleType,
            id: exampleId,
            children: [
                {name: 'service 1'},
            ],
        };
        expect(() => {
            let component = new Component(initData);
        }).toThrow();
    });

    it('root should have empty parent', () => {
        let component = new Component({ type: exampleType});
        expect(component.getRoot()).toBe(component);
        expect(component.parent).toBeUndefined();
    });

    it('children should have valid parent and root', () => {
        let initData: IComponent = {
            type: exampleType,
            children: [
                {
                    type: exampleType,
                    children: [
                        { type: exampleType }
                    ]
                },
            ],
        };
        let component = new Component(initData);
        expect(component.children[0].parent).toBe(component);
        expect(component.children[0].getRoot()).toBe(component);
        expect(component.children[0].children[0].parent).toBe(component.children[0]);
        expect(component.children[0].children[0].getRoot()).toBe(component);
    });
});

describe('Stack', () => {
    it('should have valid structure', () => {
        let stack = new Stack({});
        expect(stack.type).toBe(ComponentType.Stack);
    });

});