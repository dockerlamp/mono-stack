import { Stack } from '../../../common/stack/Stack';
import { Component as Component } from '../../../common/stack/Component';
import { ComponentType } from '../../../common/stack/interface/ComponentType';

// front component`s hierarchy
let workspaceComponent = new Component({
    type: ComponentType.Service,
    name: 'workspace'
});

let controlPanelComponent = new Component({
    type: ComponentType.Service,
    name: 'controlPanel'
});

let propertiesPanelComponent = new Component({
    type: ComponentType.Service,
    name: 'propertiesPanel',
    links: [
        {
            destinationId: controlPanelComponent.id,
        }
    ]
});

let vueComponent = new Component({
    type: ComponentType.Service,
    name: 'vue',
    children: [
        workspaceComponent,
        controlPanelComponent,
        propertiesPanelComponent
    ]
});

let expressComponent = new Component({
    type: ComponentType.Service,
    name: 'express'
});

let visComponent = new Component({
    type: ComponentType.Service,
    name: 'vis',
    links: [
        {
            destinationId: vueComponent.id,
        }
    ]
});

let frontComponent = new Component(
    {
        type: ComponentType.Service,
        name: 'front',
        children: [
            vueComponent,
            expressComponent,
            visComponent
        ],
        links: [
            {
                destinationId: expressComponent.id,
            },
        ]
    }
);

// backend component`s hierarchy

let mongooseComponent = new Component({
    type: ComponentType.Service,
    name: 'mongoose'
});

let mongoComponent = new Component({
    type: ComponentType.Service,
    name: 'mongo',
    links: [
        {
            destinationId: workspaceComponent.id,
        }
    ]
});

let stosComponent = new Component({
    type: ComponentType.Service,
    name: 'stos',
    links: [
        {
            destinationId: mongoComponent.id,
        }
    ]
});

let backComponent = new Component(
    {
        type: ComponentType.Service,
        name: 'backend',
        children: [
            mongooseComponent,
            mongoComponent,
            stosComponent,
        ],
        links: [
            {
                destinationId: stosComponent.id,
            },
            {
                destinationId: visComponent.id,
            },
        ]
    }
);

let rootComponent = new Component(
    {
        type: ComponentType.Stack,
        name: 'simple stack',
        children: [
            frontComponent,
            backComponent,
        ]
    }
);

let sampleStack = new Stack(rootComponent);

export { sampleStack };