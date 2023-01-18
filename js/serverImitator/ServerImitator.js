import { dataUrl } from '../global.js';
import { DataManager } from './DataManager.js';

class ServerImitator {
    #DataManager;
    #objPattern;

    constructor() {
        this.#objPattern = (obj) => ({
            firstName: obj.name.firstName,
            lastName: obj.name.lastName,
            about: obj.about,
            eyeColor: obj.eyeColor,
        });
        const pageSize = 10;
        this.#DataManager = new DataManager(
            dataUrl,
            this.#objPattern,
            pageSize
        );
    }

    requestGetPage(pageNumber) {
        return this.#DataManager.getPage(pageNumber);
    }

    requestSortBy(column, isAscending) {
        this.#DataManager.sortBy(column, isAscending);
    }
}

const Server = new ServerImitator();
export default Server;
