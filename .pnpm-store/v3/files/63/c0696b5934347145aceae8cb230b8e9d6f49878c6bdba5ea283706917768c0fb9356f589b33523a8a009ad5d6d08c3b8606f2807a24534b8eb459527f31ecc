import { Item } from './item.js';
import { Postable } from './postable.js';
import { VariablePool } from './variable_pool.js';
import { KeyNavigatable } from './key_navigatable.js';
import { MouseNavigatable } from './mouse_navigatable.js';
export interface Menu extends Postable, KeyNavigatable, MouseNavigatable {
    baseMenu: Menu;
    items: Item[];
    pool: VariablePool<string | boolean>;
    focused: Item;
    unpostSubmenus(): void;
    find(id: string): Item;
    generateMenu(): void;
}
