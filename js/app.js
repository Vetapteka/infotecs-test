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

    //TODO: убрать clamp, потому что либы запрещены
    function createItem(text, key) {
        const el = document.createElement('div');
        el.className = `item ${key}`;
        const textItem = document.createElement('p');
        textItem.textContent = text;
        if (key === 'about') $clamp(textItem, {clamp: 2});
        if (key === 'eyeColor') {
            el.innerHTML = `<img src="./images/eye-${text}.png" alt="\">`;
        }
        el.appendChild(textItem);
        return el;

    }

    return arr.map((data, index) => {
            const row = document.createElement('div');
            row.className = 'row';
            row.style.order = `${index + 1}`;
            for (let key in data) {
                if (key !== 'rowIndex')
                    row.appendChild(createItem(data[key], key));
            }
            row.innerHTML += '<hr class="hover-control">';
            row.onclick = showEditPanel;
            return row;
        }
    )
}

const editPanel = document.getElementById('edit-panel__body');

function showEditPanel(event) {

    function getHr(el) {
        let hr;
        if (el.tag !== 'hr') {
            while (!el.classList.contains('row'))
                el = el.parentNode;
            hr = el.getElementsByTagName('hr')[0];
        } else {
            hr = el;
        }
        return hr;
    }

    editPanel.classList.add('visible');

    const hr = getHr(event.target);
    hr.classList.add('visible');

    const hrCoord = hr.getBoundingClientRect();
    const panelCoordX = Math.ceil(hrCoord.x + hr.offsetWidth - 2);
    const panelCoordY = Math.ceil(hrCoord.y + window.scrollY - 20);

    editPanel.style.top = `${panelCoordY}px`;
    editPanel.style.left = `${panelCoordX}px`;
}

function showHideColumn(target) {
    target.classList.toggle('hidden');
    document.querySelectorAll(`.${target.name}`).forEach(e => e.classList.toggle('hidden'));
}

function sortBtnHandler(target) {
    function byField(field, isAscending) {
        return (isAscending) ?
            (a, b) => a[field] > b[field] ? 1 : -1
            : (a, b) => a[field] < b[field] ? 1 : -1;
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
    })
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
        eyeColor: el.eyeColor
    }
});

// получаем массив HTML-строк и вставляем его в документ
const rows = dataToHTMLrows(data);
rows.forEach((el) => {
    document.getElementById('table__body').appendChild(el);
});


