export class DataManager {
    #data;
    #pageSize;
    #pageCount;

    constructor(url, objPattern, pageSize) {
        this.#pageSize = pageSize;
        this.#data = this.#getData(url).map((obj) => objPattern(obj));
        this.#pageCount = Math.ceil(this.#data.length / this.#pageSize);
    }

    #getData(url) {
        const xhr = new XMLHttpRequest();
        let data;
        xhr.open('GET', url, false);
        xhr.onload = () => {
            if (xhr.status !== 200) {
                return;
            }
            data = JSON.parse(xhr.response);
        };
        xhr.send();
        return data;
    }

    getPage(pageNumber) {
        if (1 <= pageNumber && pageNumber <= this.#pageCount) {
            const start = (pageNumber - 1) * this.#pageSize;
            const end = start + this.#pageSize;
            return this.#data.slice(start, end);
        }
        else {
            throw new RangeError();
        }
    }

    sortBy(column, isAscending) {
        const comparator = this.#createComparator(column, isAscending);
        this.#data.sort(comparator);
        console.log(this.#data);
    }

    #createComparator(field, isAscending) {
        return isAscending
            ? (a, b) => (a[field] > b[field] ? 1 : -1)
            : (a, b) => (a[field] < b[field] ? 1 : -1);
    }
}
