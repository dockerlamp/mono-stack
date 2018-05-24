import { IComponent } from '../../common/stack/interface/IComponent';

export interface IStackDb {
    insertComponent(component: IComponent): Promise<IComponent>;
    getComponentById(id: string): Promise<IComponent>;
}