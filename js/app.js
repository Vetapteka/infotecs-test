//функция для получения данных из JSON и преобразования в массив объектов
function getData() {
    const requestURL = './data/data.json';
    const xhr = new XMLHttpRequest();
    let data;
    xhr.open('GET', requestURL, false);
    xhr.onload = () => {
        if (xhr.status !== 200) {
            return;
        }
        data = JSON.parse(xhr.response);
    };
    xhr.send();
    return data;
}

// функция для преобразования массива объектов в HTML-элементы
function dataToHTMLrows(arr) {
    function createItem(textContent, key) {
        const el = document.createElement('div');
        el.className = `item ${key}`;
        el.innerHTML = `<p>${textContent}</p>`;
        if (key === 'eyeColor') {
            el.innerHTML += `<img src="./images/eye-${textContent}.png" alt="\">`;
        }
        return el;
    }

    return arr.map((data, index) => {
        const row = document.createElement('div');
        if (index >= 10) row.classList.add('hide');
        row.classList.add('row');

        //изначально вывод строк по умолчанию так, как в  json
        row.style.order = `${index}`;
        for (let key in data) {
            if (key !== 'rowIndex') row.appendChild(createItem(data[key], key));
        }
        row.innerHTML += '<hr class="hover-control">';
        row.onclick = showEditPanel;
        return row;
    });
}

// Преобразовываем полученные данные из JSON в массив обектов,
// где получаем только нужные данные (имя, фамилию, описание и цвет глаз)
// + добавляем поле index для дальнейшей сортировки

const data = getData().map((el, i) => {
    return {
        rowIndex: i,
        firstName: el.name.firstName,
        lastName: el.name.lastName,
        about: el.about,
        eyeColor: el.eyeColor,
    };
});

// получаем массив HTML-строк и вставляем его в документ
const rows = dataToHTMLrows(data);
const placeToAppend = document.getElementById('table__rows');
rows.forEach((el) => {
    placeToAppend.appendChild(el);
});

//объект, позволяющий работать с value у кнопок "след/пред страница"
const turnPageControl = {
    curPage: 1,
    nextPage: {
        node: document.getElementById('btn-next-page'),
        changeValue(cur) {
            this.node.value = cur + 1;
        },
    },
    prevPage: {
        node: document.getElementById('btn-prev-page'),
        changeValue(cur) {
            this.node.value = cur - 1;
        },
    },

    initBtnHandler(handler) {
        this.nextPage.node.onclick = handler;
        this.prevPage.node.onclick = handler;
    },

    changePageValues(curPage) {
        turnPageControl.curPage = curPage;
        this.nextPage.changeValue(curPage);
        this.prevPage.changeValue(curPage);
    },

    reset() {
        this.nextPage.changeValue(1);
        this.prevPage.changeValue(-1);
        rows.forEach((row) => {
            if (+row.style.order < 10) {
                row.classList.remove('hide');
            } else {
                row.classList.add('hide');
            }
        });
    },
};

//обработчик на кнопки перелистывания страниц
turnPageControl.initBtnHandler(btnTurnPageHandler);

function btnTurnPageHandler() {
    //количество страниц всего
    const pagesCount = Math.floor(data.length / 10);

    //получаем номер страницы, на которую хотим перейти
    const page = +this.value;
    if (page === 0 || page === pagesCount + 1) {
        return;
    }

    //будем toggle('hide') у строк текущей страницы и на странице, куда хотим перейти
    //пример: если мы на странице 3, нажатие кнопки "след стр" => надо перейти на стр 4
    //значит с 20 по 29 строки нужно скрыть, 30-39 показать
    //такой алгоритм позволяет иметь один обработчик на обе кнопки

    let end =
        page >= pagesCount
            ? data.length - 1
            : Math.max(turnPageControl.curPage, page) * 10 - 1;

    let start = (Math.min(turnPageControl.curPage, page) - 1) * 10;

    rows.filter(
        (row) => +row.style.order <= end && +row.style.order >= start
    ).forEach((row) => {
        row.classList.toggle('hide');
    });

    //меняем значение value у кнопок
    turnPageControl.changePageValues(page);
}

//обработчик на кнопку скрыть колонку
document.querySelectorAll('.hide-control').forEach((btn) => {
    btn.onclick = () => hideColumnBtnHandle(btn);
});

function hideColumnBtnHandle(target) {
    target.classList.toggle('hidden');
    document
        .querySelectorAll(`.${target.name}`)
        .forEach((e) => e.classList.toggle('hidden'));
}

//вешаем обработчик на кнопку сортировки
document.querySelectorAll('.sort-control').forEach((btn) => {
    btn.onclick = () => sortBtnHandler(btn);
});

function sortBtnHandler(target) {
    function byField(field, isAscending) {
        return isAscending
            ? (a, b) => (a[field] > b[field] ? 1 : -1)
            : (a, b) => (a[field] < b[field] ? 1 : -1);
    }

    //смена направления сортировки (по возрастанию/по убыванию)
    const isAscending = target.value;
    target.value = isAscending ? '' : '1';

    //сортируется массив объектов data
    const field = target.name;
    data.sort(byField(field, isAscending));

    /* В массиве объектов data поле rowIndex каждого объекта соответствует порядковому
    номеру элемента (индексу) в массиве HTML-объектов rows. После сортировки data элементы будут расположены в новом порядке,
    но соответсвие rowIndex сохранится. Тогда последовательность вывода rows после сортировки data нужно поменять:
    каждому из rows присвоим order (используем grid),
    равный порядкому номеру соответствующего элемента из отсортированного data.
    */
    data.forEach((el, i) => {
        rows[el.rowIndex].style.order = i;
    });
    //делаем видимой только первую страницу
    turnPageControl.reset();

    //при сортировке закрываем панель редактирования
    editPanel.hidePanelNode();
}

//панель редактирования
const editPanel = {
    node: document.getElementById('edit-panel__body'),
    rowNode: null,
    hrNode: null,

    initRowHrNodes(rowNode) {
        this.rowNode = rowNode;
        this.hrNode = this.rowNode.getElementsByTagName('hr')[0];
    },

    showPanelNode(coord) {
        this.node.classList.add('visible');
        this.hrNode.classList.add('visible');
        this.node.style.left = `${coord.x}px`;
        this.node.style.top = `${coord.y}px`;
    },

    hidePanelNode() {
        this.node?.classList.remove('visible');
        this.hideHrNode();
    },

    hideHrNode() {
        this.hrNode?.classList.remove('visible');
    },
};

//обработчик для нажатия на строку
function showEditPanel(event) {
    //click на любой элемент строки обрабатывается этой функцией, поэтому ищем саму строку
    function getRow(el) {
        while (!el.classList.contains('row')) el = el.parentNode;
        return el;
    }

    //панель должна отображаться справа от таблицы и касаться выделяющего строку <hr>
    function calcPanelCoord(hr) {
        const hrCoord = hr.getBoundingClientRect();
        const panelCoordX = Math.ceil(hrCoord.x + hr.offsetWidth - 2);
        const panelCoordY = Math.ceil(hrCoord.y + window.scrollY - 20);
        return { x: panelCoordX, y: panelCoordY };
    }

    //если панель открыта (то есть уже проинициализирована) и мы нажимаем на другую строку,
    //то прошлый <hr> должен скрыться
    if (editPanel.hrNode) editPanel.hideHrNode();

    //инициализируем панель, как панель отвечающую за редактирование этой строки
    editPanel.initRowHrNodes(getRow(event.target));

    const panelCoord = calcPanelCoord(editPanel.hrNode);
    editPanel.showPanelNode(panelCoord);
}

//обработчик на отменение изменений данных
document.getElementById('btn-cansel').onclick = () => editPanel.hidePanelNode();

//обработчик на отправку формы
const form = document.getElementById('edit-form');
form.addEventListener('submit', handleFormSubmit);

function handleFormSubmit(event) {
    event.preventDefault();
    const dataForm = new FormData(event.target);
    const rowNode = editPanel.rowNode;
    const dataIndex = rowNode.style.order;

    for (const pair of dataForm.entries()) {
        data[dataIndex][pair[0]] = pair[1];
        let rowItem = rowNode.getElementsByClassName(`${pair[0]}`)[0];
        rowItem.getElementsByTagName('p')[0].textContent = `${pair[1]}`;
        rowItem
            .getElementsByTagName('img')[0]
            ?.setAttribute('src', `./images/eye-${pair[1]}.png`);
    }

    editPanel.hidePanelNode();
}
