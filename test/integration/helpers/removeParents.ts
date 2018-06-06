import { IComponent } from '../../../src/common/stack/interface/IComponent';

export const removeParents = (component: IComponent): void => {
    for (let element of component.walk()) {
        delete element.parent;
    }
};