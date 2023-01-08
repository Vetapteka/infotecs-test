export const objDestruct = (obj) => ({
    firstName: obj.name.firstName,
    lastName: obj.name.lastName,
    about: obj.about,
    eyeColor: obj.eyeColor,
});

export const selectors = {
    table_body: '.table__body',
    table_row__container: '.table__body > .row__container',
    table_btn_sort: '.table__body > .table__row button.sort',
    table_btn_hide: '.table__body > .table__row button.hide',
};

export const rowContainerNode = document.querySelector(
    selectors.table_row__container
);
export const tableBtnSortNode = document.querySelector(
    selectors.table_btn_sort
);
export const tableBtnHideNode = document.querySelector(
    selectors.table_btn_hide
);
