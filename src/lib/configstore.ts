import Configstore from "configstore";
class ConfigStore {

    conf: Configstore;

    constructor(id: string) {
        this.conf = new Configstore(id);
    }

    clearConfig() {
        this.conf.clear()
    }

    getFolderPath(): string | undefined {
        return this.conf.has("folderPath") ? this.conf.get("folderPath").folderPath: undefined
    }

    setFolderPath(folderPath: string) {
        this.conf.set("folderPath", folderPath)
    }

}

export default ConfigStore;
