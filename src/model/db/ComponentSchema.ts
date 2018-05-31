import { Schema } from 'mongoose';

import { ComponentType } from '../../common/stack/interface/ComponentType';

// tslint:disable-next-line variable-name
export const ComponentSchema = new Schema({
    id: String,
    type: {
        type: ComponentType,
    },
    children: [],
    links: [],
    ports: [],
}, {strict: false});
