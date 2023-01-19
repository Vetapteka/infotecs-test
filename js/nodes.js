export const selectors = {
    table_body: '.table__body',
    table_row__container: '.table__body > .row__container',
    table_btn_sort: '.table__body > .table__row button.sort',
    table_btn_hide: '.table__body > .table__row button.hide',
    table_btn_pagination_next: '.table__body > .table__pagination button.next',
    table_btn_pagination_prev: '.table__body > .table__pagination button.prev',
    modal: '.table-form__body',
    modal_form: '.table-form__body form',
    modal_btn_form_submit: '.table-form__body button.submit',
    modal_btn_form_cancel: '.table-form__body button.cancel',
};

export const rowContainerNode = document.querySelector(
    selectors.table_row__container
);
export const tableBtnSortNodes = document.querySelectorAll(
    selectors.table_btn_sort
);
export const tableBtnHideNodes = document.querySelectorAll(
    selectors.table_btn_hide
);
export const tableBtnPaginationNext = document.querySelector(
    selectors.table_btn_pagination_next
);
export const tableBtnPaginationPrev = document.querySelector(
    selectors.table_btn_pagination_prev
);

export const modal = document.querySelector(selectors.modal);
export const modalForm = document.querySelector(selectors.modal_form);
export const modalBtnSubmit =  document.querySelector(selectors.modal_btn_form_submit);
export const modalBtnCancel =  document.querySelector(selectors.modal_btn_form_cancel);
