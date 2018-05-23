import { Component } from './Component';
import { IComponent } from './interface/IComponent';
import { ComponentType } from './interface/ComponentType';

export class Stack extends Component {
    constructor(initialData: IComponent = {}) {
        initialData.type = ComponentType.Stack;
        super(initialData);
    }
}