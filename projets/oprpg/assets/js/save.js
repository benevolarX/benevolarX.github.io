"use strict";

class Save
{
    instance = new Save();

    constructor(session = true) 
    {
        this.storage = session ? window.sessionStorage : window.localStorage;
        Save.instance = this;
    }

    static Session()
    {
        this.instance.storage = window.sessionStorage;
        return this.instance;
    }

    static Local()
    {
        this.instance.storage = window.localStorage;
        return this.instance;
    }

    has (key) {
        return this.storage.hasOwnProperty(key);
    }

    get (key, def = null)
    {
        let res = this.storage.get(key);
        if (res === null) {
            return def;
        }
        let type = typeof res;
        if (type === "boolean" || type === "number") {
            return res;
        }
        if (type === "string" && res != "") {
            try {
                let o = JSON.parse(res);
                if (typeof o === "object") {
                    return o;
                }
                return res;
            }
            catch {
                return def;
            }
        }
        return def;
    }

    set (key, val) 
    {
        let s = val;
        if (typeof val === "object") {
            s = JSON.stringify(val);
        }
        this.storage.setItem(key, s);
        return this;
    }

    removeItem(key) {
        this.storage.removeItem(key);
        return this;
    }

    clear() {
        this.storage.clear();
        return this;
    }

    get length() {
        return this.storage.length;
    }

}