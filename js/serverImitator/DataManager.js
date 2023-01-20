export class DataManager {
    #data;
    #pageSize;
    #pageCount;

    constructor(data, pageSize) {
        this.#data = data;
        this.#pageSize = pageSize;
        this.#pageCount = Math.ceil(this.#data.length / this.#pageSize);
    }

    static async getDataManager(url, objPattern, pageSize) {
        const data = await fetch(url);
        const dataJson = await data.json();
        const formattedData = dataJson.map((obj) => objPattern(obj));

        return new DataManager(formattedData, pageSize);
    }

    #createComparator(field, isAscending) {
        return isAscending
            ? (a, b) => (a[field] > b[field] ? 1 : -1)
            : (a, b) => (a[field] < b[field] ? 1 : -1);
    }

    getPage(pageNumber) {
        if (1 <= pageNumber && pageNumber <= this.#pageCount) {
            const start = (pageNumber - 1) * this.#pageSize;
            const end = start + this.#pageSize;
            return this.#data.slice(start, end);
        } else {
            throw new RangeError();
        }
    }

    sortBy(column, isAscending) {
        const comparator = this.#createComparator(column, isAscending);
        this.#data.sort(comparator);
    }

    setDataItem(obj, index) {
        this.#data[index] = obj;
    }
}

/* статичесая функа по возврату данных */
