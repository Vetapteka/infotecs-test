import Server from '../serverImitator/ServerImitator.js';
import { getEyeImgPath } from '../global.js';

export class Table {
    #curPageData;
    #curPageNumber = 1;

    #rowNodes;
    #columnNodes;
    #whereInsertNode;

    constructor(whereInsertNode) {
        this.#whereInsertNode = whereInsertNode;
        this.#update(Server.requestGetPage(this.#curPageNumber));
    }

    #update(newPageData) {
        this.#curPageData = newPageData;
        this.#columnNodes = this.#initColumnNodes();
        this.#rowNodes = this.#initRowNodes();
        this.#insertRowNodes();
    }

    #initColumnNodes() {
        /* инициализация */
        const columnNodes = {};
        Object.keys(this.#curPageData[0]).forEach(
            (key) => (columnNodes[key] = [])
        );

        /* заполнение */
        this.#curPageData.forEach((obj) => {
            Object.entries(obj).forEach(([key, value]) => {
                columnNodes[key].push(this.#itemPattern(key, value));
            });
        });

        return columnNodes;
    }

    #initRowNodes() {
        const rowNodesSize = this.#curPageData.length;
        var rowNodes = new Array(rowNodesSize);
        for (var i = 0; i < rowNodesSize; rowNodes[i++] = this.#rowPattern());

        Object.values(this.#columnNodes).forEach((col) => {
            col.forEach((e, i) => {
                rowNodes[i].appendChild(e);
            });
        });

        return rowNodes;
    }

    #insertRowNodes() {
        this.#whereInsertNode.replaceChildren();
        this.#rowNodes.forEach((node) => {
            this.#whereInsertNode.appendChild(node);
        });
    }

    #itemPattern = (name, textContent) => {
        const item = document.createElement('div');
        item.className = name;
        item.innerHTML = `<p>${textContent}</p>`;
        if (name === 'eyeColor')
            item.innerHTML += `<img src="${getEyeImgPath(textContent)}"
             alt="${textContent}">`;
        return item;
    };

    #rowPattern = () => {
        const row = document.createElement('div');
        row.className = 'table__row';
        row.innerHTML = '<hr class="hover-control">';
        return row;
    };

    sortBy(column, isAscending) {
        Server.requestSortBy(column, isAscending);
        this.#update(Server.requestGetPage(this.#curPageNumber));
    }

    hideColumn(column) {
        this.#columnNodes[column].forEach((item) =>
            item.classList.toggle('hidden')
        );
    }
}
