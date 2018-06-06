import { Schema } from 'mongoose';

import { ComponentType } from '../../common/stack/interface/ComponentType';

// tslint:disable-next-line variable-name
export const StackSchema = new Schema({
    id: String,
    type: {
        type: String,
        default: ComponentType.Stack,
    },
    children: [],
    links: [],
    ports: [],
    user: {type: Schema.Types.ObjectId, ref: 'user'},
}, {strict: false});
