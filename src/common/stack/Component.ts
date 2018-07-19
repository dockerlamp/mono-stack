import * as uuid from 'uuid';
import * as _ from 'lodash';

import { IComponent } from './interface/IComponent';
import { ComponentType } from './interface/ComponentType';
import { ILink } from './interface/ILink';
import { IPort } from './interface/IPort';
import { ComponentError } from './ComponentError';

interface IIdsList {
    [key: string]: boolean;
}

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
            throw new ComponentError('Empty component type');
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

    public getNestingLevel(): Number {
        let currentNode: Component = this;
        let level = 0;
        while (currentNode.parent) {
            level++;
            currentNode = currentNode.parent;
        }
        return level;
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
        try {
            let ids: IIdsList = this.getAllIds(); // get list and thorw error if dupplication found
            for (let component of this.walk()) {
                this.validateComponent(component, errors);
                this.validateComponentLinks(component, ids, errors);
                this.validateComponentPorts(component, errors);
            }
        } catch (error) {
            if (error instanceof ComponentError) {
                errors.push(error.message);
            } else {
                throw error;
            }
        }

        return errors;
    }

    private getAllIds(): IIdsList {
        let ids: IIdsList = {};
        for (let component of this.getRoot().walk()) {
            if (ids[component.id]) {
                throw new ComponentError(`Dupplicated id ${component.id}`);
            }
            ids[component.id] = true;
        }

        return ids;
    }

    private validateComponent(component: Component, errors: string[]) {
        if (!component.id) {
            errors.push(`Component without id ${component.type}/${component.name}`);
        }
    }

    private validateComponentPorts(component: Component, errors: string[]) {
        for (let port of component.ports) {
            if (!port.id) {
                errors.push(`Port without id ${component.id}/${port.port}`);
            }

            if (! ((port.port > 0) && (port.port < 65635) ) ) {
                errors.push(`Wrong port number ${component.id}/${port.id}`);
            }
        }
    }

    private validateComponentLinks(component: Component, ids: IIdsList, errors: string[]) {
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
                throw new ComponentError('Empty port number');
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
                throw new ComponentError('Empty link destinationId');
            }
            if (!link.id) {
                link.id = uuid.v4();
            }
            return link;
        });
    }
}