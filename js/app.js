import { Table } from './table/Table.js';
import * as global from './global.js';
import * as nodes from './nodes.js';

const table = new Table(global.dataUrl, nodes.objDestruct);
table.insertRowNodes(nodes.rowContainerNode);

/* TODO: куда-то надо переместить эту функу */
const btnSortHandler = (event) => {
    const isAscending = event.target.value === 'asc';
    const column = event.target.name;
    table.sortBy(column, isAscending);

    event.target.value = event.target.value === 'asc' ? 'desc' : 'asc';
};


nodes.tableBtnSortNodes.forEach((btn) => {
    btn.addEventListener('click', btnSortHandler);
});
