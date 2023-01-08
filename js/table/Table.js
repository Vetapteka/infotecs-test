import { useItemPattern, useRowPattern, comparator } from './utilites.js';

export class Table {
    data = null;
    rows = [];
    rowNodes = null;

    constructor(url, objDestruct) {
        this.data = this.initData(url);
        this.rows = this.initRows(objDestruct);
        this.rowNodes = this.initRowNodes(useItemPattern, useRowPattern);
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

    initRowNodes(itemPattern, rowPattern) {
        return this.rows.map((obj, i) => {
            const rowContent = Object.entries(obj)
                .map(([key, value]) =>
                    key !== 'rowIndex' ? itemPattern(key, value) : ''
                )
                .join('');

            return rowPattern(rowContent, i);
        });
    }

    insertRowNodes(where) {
        this.rowNodes.forEach((node) => {
            where.appendChild(node);
        });
    }

}
