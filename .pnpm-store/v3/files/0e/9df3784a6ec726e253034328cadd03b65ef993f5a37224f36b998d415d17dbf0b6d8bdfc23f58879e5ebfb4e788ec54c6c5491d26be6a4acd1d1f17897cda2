import { StackItemClass, StackItem } from './StackItem.js';
import ParseOptions from './ParseOptions.js';
import { AbstractFactory } from '../../core/Tree/Factory.js';
export default class StackItemFactory extends AbstractFactory<StackItem, StackItemClass> {
    static DefaultStackItems: {
        [kind: string]: StackItemClass;
    };
    defaultKind: string;
    configuration: ParseOptions;
}
