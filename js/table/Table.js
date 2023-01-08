import { useItemPattern, useRowPattern, comparator } from './utilites.js';

export class Table {
    data = null;
    rows = null;
    rowNodes = null;
    columnNodes = null;

    constructor(url, objDestruct) {
        this.data = this.initData(url);
        this.rows = this.initRows(objDestruct);
        this.columnNodes = this.initColumnNodes();
        this.rowNodes = this.initRowNodes();
    }

    initData(url) {
        const xhr = new XMLHttpRequest();
        let data;
        xhr.open('GET', url, false);
        xhr.onload = () => {
            if (xhr.status !== 200) {
                return;
            }
            data = JSON.parse(xhr.response);
        };
        xhr.send();
        return data;
    }

    initRows(objDestruct) {
        return this.data.map((e, i) => {
            const row = objDestruct(e);
            row.rowIndex = i;
            return row;
        });
    }

    initRowNodes() {
        const rowNodes = [];
        for (let i = 0; i < this.data.length; i++) {
            rowNodes[i] = useRowPattern(i);
        }

        Object.values(this.columnNodes).forEach((col) => {
            col.forEach((e, i) => {
                rowNodes[i].appendChild(e);
            });
        });

        return rowNodes;
    }

    initColumnNodes() {
        const columnNodes = {};
        this.rows.forEach((obj, i) => {
            Object.entries(obj).forEach(([key, value]) => {
                if (key === 'rowIndex') return;
                if (i === 0) columnNodes[key] = [];
                columnNodes[key].push(useItemPattern(key, value));
            });
        });
        return columnNodes;
    }

    insertRowNodes(where) {
        this.rowNodes.forEach((node) => {
            where.appendChild(node);
        });
    }

    sortBy(column, isAscending) {
        this.rows.sort(comparator(column, isAscending));
        this.rows.forEach((row, i) => {
            this.rowNodes[row.rowIndex].style.order = i;
        });
    }

    hideColumn(column) {
        this.columnNodes[column].forEach((item) =>
            item.classList.toggle('hidden')
        );
    }
}
