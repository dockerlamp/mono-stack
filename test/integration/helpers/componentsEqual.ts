import { IComponent } from '../../../src/common/stack/interface/IComponent';

export const componentsEqual = (dbComponent: IComponent, component: IComponent): boolean => {
    let serializedDbComponentJsonString = JSON.stringify(dbComponent, Object.keys(dbComponent).sort());
    let serializedComponentJsonString = JSON.stringify(component, Object.keys(component).sort());
    return serializedDbComponentJsonString === serializedComponentJsonString;
};