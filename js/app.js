import { Table } from './components/Table.js';
import * as nodes from './nodes.js';


/* создает таблицу */
const table = new Table(nodes.rowContainerNode);

/* кнопка сортировки */
const btnSortHandler = (event) => {
    const isAscending = event.target.value === 'asc';
    const columnName = event.target.name;
    table.sortBy(columnName, isAscending);

    event.target.value = event.target.value === 'asc' ? 'desc' : 'asc';
};

/* кнопка скрытия */
const btnHideHandler = (event) => {
    event.target.classList.toggle('view-eye');
    const columnName = event.target.name;
    table.hideColumn(columnName);
};

/* вешаем колбек на сортировку */
nodes.tableBtnSortNodes.forEach((btn) => {
    btn.addEventListener('click', btnSortHandler);
});

/* вешаем колбек на скрытие */
nodes.tableBtnHideNodes.forEach((btn) => {
    btn.addEventListener('click', btnHideHandler);
});
