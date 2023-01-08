const useItemPattern = (name, textContent) =>
    `<div class="${name}"><p>${textContent}</p></div>`;

const useRowPattern = (content, order) => {
    const row = document.createElement('div');
    row.style.order = order;
    row.className = 'table__row';
    row.innerHTML = content;
    return row;
};

const comparator = (field, isAscending) => {
    return isAscending
        ? (a, b) => (a[field] > b[field] ? 1 : -1)
        : (a, b) => (a[field] < b[field] ? 1 : -1);
};

export { useItemPattern, useRowPattern, comparator };
