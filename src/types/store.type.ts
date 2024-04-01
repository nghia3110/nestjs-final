import { Store } from 'src/database';

export type TStore = Partial<Store> & { isStore?: boolean };
