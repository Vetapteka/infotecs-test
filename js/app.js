import { Modal } from './components/Modal.js';
import { Table } from './components/Table.js';
import * as nodes from './nodes.js';

const table = new Table(nodes.rowContainerNode);
const modal = new Modal(nodes.modal, table);

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
    btn.onclick = btnSortHandler;
});

nodes.tableBtnHideNodes.forEach((btn) => {
    btn.onclick = btnHideHandler;
});

nodes.tableBtnPaginationNext.onclick = () => {
    table.showNextPage();
};
nodes.tableBtnPaginationPrev.onclick = () => {
    table.showPrevPage();
};

nodes.modalForm.onsubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    modal.changeRow(Object.fromEntries(data.entries()));
    modal.close();
};

nodes.modalBtnCancel.onclick = () => {
    modal.close();
};
