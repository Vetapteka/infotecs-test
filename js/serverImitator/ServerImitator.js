import { dataUrl } from '../global.js';
import { DataManager } from './DataManager.js';

class ServerImitator {
    #DataManager;

    constructor(dataManager) {
        this.#DataManager = dataManager;
    }

    static async getServerImitator() {
        const pageSize = 10;
        const objPattern = (obj) => ({
            firstName: obj.name.firstName,
            lastName: obj.name.lastName,
            about: obj.about,
            eyeColor: obj.eyeColor,
        });

        const dataManager = await DataManager.getDataManager(
            dataUrl,
            objPattern,
            pageSize
        );

        return new ServerImitator(dataManager);
    }

    requestGetPage(pageNumber) {
        return this.#DataManager.getPage(pageNumber);
    }

    requestSortBy(column, isAscending) {
        this.#DataManager.sortBy(column, isAscending);
    }

    requestChangeDataItem(obj, index) {
        this.#DataManager.setDataItem(obj, index);
    }
}

/* единственный инициализированный сервер, доступен из любого модуля */
const Server = await ServerImitator.getServerImitator();
export default Server;
