import { Schema } from 'mongoose';

import { ComponentType } from '../../common/stack/interface/ComponentType';

// tslint:disable-next-line variable-name
export const ComponentSchema = new Schema({
    // if omited in schema property is not saved in mongodb! restricted key word?
    id: String,
    // statements below trigger circular reference error for mongodb
    // children: [{ type: Schema.Types.ObjectId, ref: 'ComponentSchema'}],
    // children: [ComponentSchema],
}, {strict: false});
