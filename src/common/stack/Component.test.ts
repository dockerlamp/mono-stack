import {} from 'jest';
import * as _ from 'lodash';

import { Component } from './Component';
import { ComponentType } from './interface/ComponentType';
import { IComponent } from './interface/IComponent';

const exampleType = ComponentType.Stack;
const exampleId = 'id';
const examplePort = 1234;

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

    it('children should be empty array when no children passed', () => {
        let component = new Component({ type: exampleType});
        expect(_.isArray(component.children)).toBeTruthy();
        expect(component.children).toHaveLength(0);

        component = new Component({ type: exampleType, children: []});
        expect(_.isArray(component.children)).toBeTruthy();
        expect(component.children).toHaveLength(0);
    });

    it('should have auto-generated id', () => {
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
            ports: [
                { port: examplePort }
            ]
        });
        let serializedComponentJsonString = JSON.stringify(component);
        let serializedComponentJsonObject = JSON.parse(serializedComponentJsonString);
        let unserializedComponent = new Component(serializedComponentJsonObject);

        expect(unserializedComponent.id).toBe(component.id);
        expect(unserializedComponent.type).toBe(component.type);
        expect(unserializedComponent.custom).toBe(component.custom);
        expect(unserializedComponent.children).toHaveLength(component.children.length);
        expect(unserializedComponent.ports).toHaveLength(component.ports.length);
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
        let component = new Component(initData);
        expect(component.children).toHaveLength(initData.children.length);
        expect(component.children[0].type).toBe(initData.children[0].type);
        expect(component.children[0].id).toBe(initData.children[0].id);
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

    it('should ignore constructor parent param', () => {
        let component = new Component({
            type: exampleType,
            parent: new Component({ type: exampleType })
        });
        expect(component.parent).toBeUndefined();
    });

    it('should allow to set port', () => {
        let component = new Component({
            type: exampleType,
            ports: [
                { port: examplePort }
            ]
        });
        expect(component.ports[0].port).toBe(examplePort);
        expect(component.ports[0].id).toBeDefined();
    });

    it('should not allow to set port without number', () => {
        expect(() => {
            let component = new Component({
                type: exampleType,
                ports: [
                    { }
                ]
            });
        }).toThrow();
    });

    it('should allow to configure links between components', () => {
        let component = new Component({
            type: exampleType,
            children: [
                {
                    id: '1',
                    type: exampleType,
                },
                {
                    type: exampleType,
                    links: [
                        {destinationId: '1'}
                    ]
                }
            ],
        });
        expect(component.children[1].links[0].destinationId).toBe(component.children[0].id);
    });

    it('validate should not return errors for valid structure', () => {
        let component = new Component({
            type: exampleType,
            children: [
                {
                    id: '1',
                    type: exampleType,
                    ports: [
                        { port: examplePort }
                    ]
                },
                {
                    type: exampleType,
                    links: [
                        {destinationId: '1'}
                    ],
                }
            ],
        });
        let errors = component.validate();
        expect(errors).toHaveLength(0);
    });

    it('validate should return error when id was nullified', () => {
        let component = new Component({
            type: exampleType,
            children: [
                {
                    type: exampleType,
                },
            ],
        });
        component.children[0].id = null;
        let errors = component.validate();
        expect(errors).toHaveLength(1);
    });

    it('validate should return error when id is dupplicated', () => {
        let component = new Component({
            type: exampleType,
            children: [
                {
                    type: exampleType,
                },
            ],
        });
        component.children[0].id = component.id;
        let errors = component.validate();
        expect(errors).toHaveLength(1);
    });

    it('validate should return error when link.destinationId does not exists', () => {
        let component = new Component({
            type: exampleType,
            children: [
                {
                    type: exampleType,
                    links: [
                        {destinationId: 'wrong'}
                    ],
                },
            ],
        });
        let errors = component.validate();
        expect(errors).toHaveLength(1);
    });

    it('validate should return error when port has wrong value', () => {
        let component = new Component({
            type: exampleType,
            ports: [
                { port: 1 },
            ]
        });
        component.ports[0].port = -1;
        let errors = component.validate();
        expect(errors).toHaveLength(1);
    });

    it.skip('should not modify initialData', () => {
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
        let initialDataClone = _.cloneDeep(initData);
        expect(initData).toMatchObject(initialDataClone);
        let component = new Component(initialDataClone);
        expect(initData).toMatchObject(initialDataClone);
    });
});
