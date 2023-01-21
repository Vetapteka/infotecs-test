import Server from '../serverImitator/ServerImitator.js';

export class Table {
    #curPageData;
    #curPageNumber = 1;

    #rowNodes;
    #columnNodes;
    #tableNode;

    #itemPattern;
    #rowPattern;

    constructor(whereInsertNode, rowPattren, itemPattern) {
        this.#tableNode = whereInsertNode;
        this.#itemPattern = itemPattern;
        this.#rowPattern = rowPattren;
        this.#update(Server.requestGetPage(this.#curPageNumber));
    }

    #update(newPageData) {
        this.#curPageData = newPageData;
        this.#columnNodes = this.#initColumnNodes();
        this.#rowNodes = this.#initRowNodes();
        this.#insertRowNodes();
    }

    #initColumnNodes() {
        const columnNodes = {};
        Object.keys(this.#curPageData[0]).forEach(
            (key) => (columnNodes[key] = [])
        );

        this.#curPageData.forEach((obj) => {
            Object.entries(obj).forEach(([key, value]) => {
                columnNodes[key].push(this.#itemPattern(key, value));
            });
        });

        return columnNodes;
    }

    #initRowNodes() {
        const rowNodesSize = this.#curPageData.length;
        const rowNodes = new Array(rowNodesSize);
        for (let i = 0; i < rowNodesSize; i++) {
            rowNodes[i] = this.#rowPattern(i);
        }

        Object.values(this.#columnNodes).forEach((col) => {
            col.forEach((e, i) => {
                rowNodes[i].appendChild(e);
            });
        });

        return rowNodes;
    }

    #insertRowNodes() {
        this.#tableNode.replaceChildren();
        this.#rowNodes.forEach((node) => {
            this.#tableNode.appendChild(node);
        });
    }

    sortBy(column, isAscending) {
        Server.requestSortBy(column, isAscending);
        this.#showPage(this.#curPageNumber);
    }

    hideColumn(column) {
        this.#columnNodes[column].forEach((item) =>
            item.classList.toggle('hidden')
        );
    }

    showNextPage() {
        this.#showPage(this.#curPageNumber + 1);
    }

    showPrevPage() {
        this.#showPage(this.#curPageNumber - 1);
    }

    #showPage(pageNumber) {
        try {
            this.#update(Server.requestGetPage(pageNumber));
            this.#curPageNumber = pageNumber;
        } catch (e) {}
    }

    changeRow(obj, rowIndex) {
        const index =
            rowIndex + (this.#curPageNumber - 1) * this.#rowNodes.length;
        Server.requestChangeDataItem(obj, index);
        this.#update(Server.requestGetPage(this.#curPageNumber));
    }

    getRow(index) {
        return this.#curPageData[index];
    }

    getTableNode() {
        return this.#tableNode;
    }
}
