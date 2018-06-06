import {} from 'jest';
import * as _ from 'lodash';

import { removeParents } from './removeParents';

export const compareComponent = (firstComponent, secondComponent) => {
    // eliminate circular references for compare
    removeParents(firstComponent);
    removeParents(secondComponent);
    // eliminate specific attribues added by mongoose for compare
    let attributes = ['__v', '_id', '$setOnInsert'];

    expect(_.omit(firstComponent, attributes)).toMatchObject(
        _.omit(secondComponent, attributes));
    expect(_.omit(secondComponent, attributes)).toMatchObject(
        _.omit(firstComponent, attributes));
};