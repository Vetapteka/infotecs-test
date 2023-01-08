const useItemPattern = (name, textContent) => {
    const item = document.createElement('div');
    item.className = name;
    item.innerHTML = `<p>${textContent}</p>`;
    return item;
};

const useRowPattern = (order) => {
    const row = document.createElement('div');
    row.className = 'table__row';
    row.style.order = order;

    // row.innerHTML = content;
    return row;
};

const comparator = (field, isAscending) => {
    return isAscending
        ? (a, b) => (a[field] > b[field] ? 1 : -1)
        : (a, b) => (a[field] < b[field] ? 1 : -1);
};

export { useItemPattern, useRowPattern, comparator };
