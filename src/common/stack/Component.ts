import * as uuid from 'uuid';
import * as _ from 'lodash';

import { IComponent } from './interface/IComponent';
import { ComponentType } from './interface/ComponentType';
import { ILink } from './interface/ILink';
import { IPort } from './interface/IPort';

export class Component implements IComponent {
    public id: string;
    public type: ComponentType;
    public name: string;
    public description: string;
    public children: Component[] = [];
    public links: ILink[] = [];
    public ports: IPort[] = [];
    public parent: Component;

    [customField: string]: any;

    constructor(initialData: IComponent) {
        if (!initialData.type) {
            throw new Error('Unknown type');
        }
        // parent can not be overwriten by constructor params
        let { parent, children, ports, ...writableFields } = initialData;
        Object.assign(this, writableFields);
        if (!this.id) {
            this.id = uuid.v4();
        }
        // transform children into Component array
        this.assignChildren(children);
        this.assignPorts(ports);
    }

    public getRoot(): Component {
        let currentNode: Component = this;
        while (currentNode.parent) {
            currentNode = currentNode.parent;
        }

        return currentNode;
    }

    public toJSON(): any {
        return _.omit(this, 'parent');
    }

    private assignChildren(children: IComponent[]) {
        if (!_.isArray(children)) {
            return; // ---->
        }
        this.children = children.map((childData) => {
            let child = new Component(childData);
            child.parent = this;
            return child;
        });
    }

    private assignPorts(ports: IPort[]) {
        if (!_.isArray(ports)) {
            return; // ---->
        }
        this.ports = ports.map((port) => {
            if (!port.id) {
                port.id = uuid.v4();
            }
            return port;
        });
    }
}