import { Modal } from './components/Modal.js';
import { Table } from './components/Table.js';
import * as nodes from './nodes.js';

const rowPattern = (index) => {
    const row = document.createElement('div');
    row.className = 'table__row';
    row.innerHTML = '<hr class="hover-control">';
    row.value = index;
    return row;
};

const itemPattern = (name, textContent) => {
    const item = document.createElement('div');
    item.className = name;
    item.innerHTML = `<p>${textContent}</p>`;
    if (name === 'eyeColor')
        item.innerHTML += `<img src="${getEyeImgPath(textContent)}"
         alt="${textContent}">`;
    return item;
};

const table = new Table(nodes.rowContainerNode, rowPattern, itemPattern);
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
