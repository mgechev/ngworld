import { createWorldLayout } from './layout';
import { renderWorld } from './renderer';

export const emit = (data: any) => renderWorld(createWorldLayout(data))

