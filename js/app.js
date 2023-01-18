import { Table } from './components/Table.js';
import * as nodes from './nodes.js';

const table = new Table(nodes.rowContainerNode);

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

nodes.tableBtnPaginationNext.addEventListener('click', () => {
    table.showNextPage();
});
nodes.tableBtnPaginationPrev.addEventListener('click', () => {
    table.showPrevPage();
});
