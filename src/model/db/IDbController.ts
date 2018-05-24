import { IComponent } from '../../common/stack/interface/IComponent';

export interface IDbController {
    // @TODO separate read and write interfaces?
    insertComponent(component: IComponent): Promise<IComponent>;
    getComponentById(id: string): Promise<IComponent>;
}