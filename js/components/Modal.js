export class Modal {
    #modalNode;
    #table;
    #rowHrNode;
    #rowIndex;

    constructor(modalNode, table) {
        this.#modalNode = modalNode;
        this.#table = table;
        this.#initClickListener();
    }

    #initClickListener() {
        const tableNode = this.#table.getTableNode();
        tableNode.addEventListener('click', (event) => {
            const rowNode = this.#getRowNodeByClick(event.target, tableNode);
            if (rowNode) {
                this.close();
                this.#rowHrNode = rowNode.querySelector('hr');
                this.#rowIndex = rowNode.value;
                this.#fillForm(this.#rowIndex);
                this.#showModal(this.#rowHrNode);
            }
        });
    }

    #getRowNodeByClick(clickNode, rootNode) {
        const rowClasses = rootNode.firstChild.classList;
        let rowNode;
        if (clickNode !== rootNode) {
            rowNode = clickNode;
            while (!rowNode.classList.contains(rowClasses))
                rowNode = rowNode.parentNode;
        }
        return rowNode;
    }

    #fillForm(rowIndex) {
        const rowData = this.#table.getRow(rowIndex);
        Object.entries(rowData).forEach(([fieldName, content]) => {
            const inputNode = this.#modalNode.querySelector(
                `[name=${fieldName}]`
            );

            if (inputNode.type === 'radio') {
                const radioBtns =
                    this.#modalNode.querySelectorAll('input[type=radio]');

                Array.from(radioBtns).find(
                    (node) => node.value === content
                ).checked = true;
            } else inputNode.value = content;
        });
    }

    #showModal(placeNode) {
        const coord = this.#calcPanelCoord(placeNode);
        this.#modalNode.style.left = `${coord.x}px`;
        this.#modalNode.style.top = `${coord.y}px`;
        this.#modalNode.classList.add('visible');
        placeNode.classList.add('visible');
    }

    #calcPanelCoord(hr) {
        const hrCoord = hr.getBoundingClientRect();
        const panelCoordX = Math.ceil(hrCoord.x + hr.offsetWidth - 2);
        const panelCoordY = Math.ceil(hrCoord.y + window.scrollY - 20);
        return { x: panelCoordX, y: panelCoordY };
    }

    changeRow(obj) {
        this.#table.changeRow(obj, this.#rowIndex);
    }

    close() {
        this.#modalNode?.classList.remove('visible');
        this.#rowHrNode?.classList.remove('visible');
    }
}
