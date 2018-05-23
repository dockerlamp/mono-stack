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
    public children: IComponent[] = [];
    public links: ILink[] = [];
    public ports: IPort[] = [];
    public parent: Component;

    [customField: string]: any;

    constructor(initialData: IComponent) {
        if (!initialData.type) {
            throw new Error('Unknown type');
        }
        // transform children into Component array
        if (_.isArray(initialData.children)) {
            initialData.children = initialData.children.map((childData) => {
                return new Component({
                    ...childData,
                    parent: this,
                });
            });
        }
        Object.assign(this, initialData);
        if (!this.id) {
            this.id = uuid.v4();
        }
    }

    public toJSON(): any {
        return _.omit(this, 'parent');
    }
}