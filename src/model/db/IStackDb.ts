import { IComponent } from '../../common/stack/interface/IComponent';

export interface IStackDb {
    insertOrUpdate(component: IComponent): Promise<IComponent>;
    getById(id: string): Promise<IComponent>;
}