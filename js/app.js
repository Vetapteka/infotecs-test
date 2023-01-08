import { Table } from './table/Table.js';
import * as global from './global.js';
import * as nodes from './nodes.js';

const table = new Table(global.dataUrl, nodes.objDestruct);
table.insertRowNodes(nodes.rowContainerNode);

