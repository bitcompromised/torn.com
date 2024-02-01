import fs from "fs";
import https from "https";
import http from "http";
import crypto from "crypto";

export default class Loader{
    #modules = new Map();
    loadedModules = 0;
    lastModuleLoading;
    has( module) {
        return this.#modules.has(module)
    }
    get( module, ...c){
        if(this.has( module)) return this.#modules.get( module);
        else {
            this.lastModuleLoading = module;
            return new Promise( async (resolve, reject)=>{
                try {
                    let Module = (await import(`./${module}.mjs`)).Module;
                    if (Module.type === "class") {
                        this.set(module, new Module.exports(this, ...c));

                    } else {
                        this.set(module, Module.exports);
                    }
                    this.loadedModules++;
                    resolve(this.get(module));
                } catch( err){
                    reject({error: err, lastModuleLoading: this.lastModuleLoading, loadedModules: this.loadedModules});
                }
            })
        }
    }
    set( module, value){
        this.#modules.set( module, value);
    }
    async init(){
        delete this.init;
        this.set("fs", fs);
        this.set("https", https);
        this.set("http", http);
        this.set("crypto", crypto);

        // Just a few statistics for myself
        let initDate = new Date();

        this.get("FileSystem") // fs -> FileSystem => Database -> Authenticator
            .then((a)=>{
                console.log("FileSystem Initialized")
                this.get("Logger") // FileSystem => Database
                    .then(async(m)=>{
                        console.log("Logger Initialized")
                        this.get("Database") // FileSystem + Logger -> Database => Authenticator
                            .then(async (m)=>{
                                console.log("Database Initialized")
                                this.get("Request") // fs -> Request => Authenticator
                                    .then(async (m)=>{
                                        console.log("Request Initialized")
                                        this.get("Crypt") // crypto -> Crypt
                                            .then(()=> {
                                                console.log("Crypt Initialized")
                                                this.get("Authenticator") // Request +  Crypt + Database -> Authenticator
                                                    .then(async (m)=>{
                                                        console.log("Authenticator Initialized")
                                                            // This RIGHT HERE is causing a Database Error.
                                                            // The error contains the fact that invalid databases are no self-initializing.
                                                        this.get("Torn", (await m.m.get("Database").getDatabase("targets")).get("users", {persistent_save: false}, '[]'))
                                                            .then(()=>{
                                                                console.log("Torn Initialized");
                                                            })
                                                            .finally(()=>{
                                                                //console.clear();
                                                                console.log(`All [${this.loadedModules}] Modules Loaded`);
                                                            });
                                                    })
                                                    .catch(()=>{
                                                        console.error("Failed to load Authenticator")
                                                    })
                                            })
                                            .catch(()=>{
                                                console.error("Failed to load Crypt")
                                            })
                                    })
                                    .catch(()=>{
                                        console.error("Failed to load Request")
                                    })
                            })
                            .catch((e)=>{
                                console.error("Failed to load Database", e)
                            })
                    })
                    .catch(()=>{
                        console.error("Failed to load Logger")
                    })
            })
            .catch(()=>{
                console.error("Failed to load FileSystem")
            });
        return this;
    }
}