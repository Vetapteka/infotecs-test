import { Table } from './table/Table.js';
import * as global from './global.js';
import * as nodes from './nodes.js';

const table = new Table(global.dataUrl, nodes.objDestruct);
table.insertRowNodes(nodes.rowContainerNode);

/* TODO: куда-то надо переместить эти функи */
const btnSortHandler = (event) => {
    const isAscending = event.target.value === 'asc';
    const columnName = event.target.name;
    table.sortBy(columnName, isAscending);

    event.target.value = event.target.value === 'asc' ? 'desc' : 'asc';
};

const btnHideHandler = (event) => {
    event.target.classList.toggle('view-eye');
    const columnName = event.target.name;
    table.hideColumn(columnName);
};

nodes.tableBtnSortNodes.forEach((btn) => {
    btn.addEventListener('click', btnSortHandler);
});

nodes.tableBtnHideNodes.forEach((btn) => {
    btn.addEventListener('click', btnHideHandler);
});
