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
        let { parent, children, links, ports, ...writableFields } = initialData;
        Object.assign(this, writableFields);
        if (!this.id) {
            this.id = uuid.v4();
        }
        // transform children into Component array
        this.assignChildren(children);
        this.assignLinks(links);
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

    public * walk(): Iterable<Component> {
        yield this;
        for (let child of this.children) {
            yield * child.walk();
        }
    }

    public validate(): string[] {
        let errors: string[] = [];
        let ids: any = {};
        for (let component of this.walk()) {
            if (!component.id) {
                errors.push(`Component without id ${component.type}/${component.name}`);
            }
            if (ids[component.id]) {
                errors.push(`Dupplicated id ${component.id}`);
            }
            ids[component.id] = true;
        }

        for (let component of this.walk()) {
            for (let link of component.links) {
                if (!link.id) {
                    errors.push(`Link without id ${component.id}/${link.destinationId}`);
                }
                if (!link.destinationId) {
                    errors.push(`Link without destinationId ${component.id}/${link.id}`);
                }
                if (!ids[link.destinationId]) {
                    errors.push(`Link destinationId does not exists ${component.id}/${link.destinationId}`);
                }
            }
            for (let port of component.ports) {
                if (!port.id) {
                    errors.push(`Port without id ${component.id}/${port.port}`);
                }
                if (!port.port) {
                    errors.push(`Port without number ${component.id}/${port.id}`);
                }
            }
        }
        return errors;
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
            if (!port.port) {
                throw new Error('Empty port number');
            }
            if (!port.id) {
                port.id = uuid.v4();
            }
            return port;
        });
    }

    private assignLinks(links: ILink[]) {
        if (!_.isArray(links)) {
            return; // ---->
        }
        this.links = links.map((link) => {
            if (!link.destinationId) {
                throw new Error('Empty link destinationId');
            }
            if (!link.id) {
                link.id = uuid.v4();
            }
            return link;
        });
    }
}