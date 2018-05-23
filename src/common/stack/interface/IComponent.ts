import { ComponentType } from './ComponentType';
import { ILink } from './ILink';
import { IPort } from './IPort';

export interface IComponent {
    id?: string;
    type?: ComponentType;
    name?: string;
    description?: string;
    children?: IComponent[];
    links?: ILink[];
    ports?: IPort[];
    parent?: IComponent;

    [customField: string]: any;
}