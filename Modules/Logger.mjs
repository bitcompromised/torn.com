
let Module = {
    type: "class",
    exports: class {
        log(){}
        warn(){}
        debug(){}
        error(){}
        constructor(modules){
            //this.db = modules.get("Database");
        }
    }
}
export {
    Module
}