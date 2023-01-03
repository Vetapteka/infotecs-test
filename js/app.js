//функция для получения данных из JSON и преобразования в массив объектов
function getData() {
    const requestURL = './data/copy.json';
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
    function createItem(text, NumberOfLines) {
        const el = document.createElement('div');
        el.className = 'item';
        const textItem = document.createElement('p');
        textItem.textContent = text;
        if (NumberOfLines) $clamp(textItem, {clamp: NumberOfLines});
        el.appendChild(textItem);
        return el;

    }

    return arr.map((data, index) => {
            const row = document.createElement('div');
            row.className = 'row';
            row.style.order = `${index + 1}`;
            for (let key in data) {
                switch (key) {
                    case 'rowIndex':
                        break;
                    case 'about':
                        row.appendChild(createItem(data[key], 2));
                        break;
                    default:
                        row.appendChild(createItem(data[key]));
                }

            }
            return row;
        }
    )
}

//TODO: добавить функционал скрытия строк
function showHideColumn(target) {
    if (target.classList.contains('view')) {
        target.classList.remove('view')
    } else {
        target.classList.add('view')
    }

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


