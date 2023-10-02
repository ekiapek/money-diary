import path from "node:path";
import fs from "fs";
import { logger } from "../logging/winston";
import { appDirectory } from "../../common/constants";

const dbPath = path.join(appDirectory, '/data');

export class JsonDB {
    private static _instance: JsonDB;
    private data!: Map<string, Array<any>>;

    /**
     *
     */
    private constructor() {
    }

    public static getInstance(): JsonDB {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new JsonDB();
        this._instance.data = new Map<string, any>();
        let dbExists = fs.existsSync(dbPath);
        if (!dbExists) {
            fs.mkdirSync(dbPath, { recursive: true });
        } else {
            // load data from json files
            let fileNames = fs.readdirSync(dbPath).filter(file => file.match(/\.json$/));
            fileNames.forEach((fileName: string) => {
                let typeName = fileName.match(/(^.*?)\.json/);
                if (typeName) {
                    fs.readFile(path.join(dbPath, fileName), 'utf8', (err, data) => {
                        if (err) {
                            logger.error(err);
                        }
                        logger.info(fileName)
                        logger.info(data)
                        let jsonData = JSON.parse(data);
                        let key = path.parse(fileName).name
                        logger.info(key)
                        this._instance.data.set(key, jsonData);
                    })

                }
            });
        }

        return this._instance;
    }

    // public initArray<T>(key: string) {
    //     this.data.set(key, new Array<T>());
    // }

    public getData<T>(key: string): Array<T> {
        return this.data.get(key) as Array<T>;
    }

    public pushData<T>(key: string, data: any) {
        let arr = this.data.get(key)
        if (!arr) {
            arr = new Array<T>();
        }
        arr.push(data)
        this.data.set(key, arr)
    }

    public updateData(key: string, data: any): boolean {
        let array = this.data.get(key);
        if (array) {
            const index = array.findIndex(prop => prop.id === data.id);
            array[index] = data;
            this.data.set(key, array);
            return true;
        }
        throw Error("data not found");
    }

    public removeById(key: string, id: string): boolean {
        let array = this.data.get(key);
        if (array) {
            const index = array.findIndex(prop => prop.id === id);
            array.splice(index, 1);
            this.data.set(key, array);
            return true;
        }
        throw Error("data not found");
    }

    public persistData(key?: string) {
        if (!key) {
            // write all data to their json
            this.data.forEach((value, key) => {
                let jsonString = JSON.stringify(value);
                fs.writeFile(path.join(dbPath, key + ".json"), jsonString, (err) => {
                    if (err) {
                        logger.error(err);
                    }
                })
            })
        } else {
            let records = this.data.get(key);
            if (!records) {
                throw Error("invalid object key");
            }
            let jsonString = JSON.stringify(records);
            fs.writeFile(path.join(dbPath, key + ".json"), jsonString, (err) => {
                if (err) {
                    logger.error(err);
                }
            })

        }
    }

    public static groupBy(xs:any, f:any) {
        return xs.reduce((r:any, v:any, i:any, a:any, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {});
      }
}