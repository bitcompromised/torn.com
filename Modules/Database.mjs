// a class that represents a singely entry in a database initialized on object logs
class Entry{
    #f;
    #logs;
    set(key, value){
        this.#logs[key] = value;
        return value;
    }
    delete(key){
        if(this.#logs[key]) delete this.#logs[key];
        return 1;
    }
    get(key, def){
        if(this.#logs[key]) return this.#logs[key];
        else {
            this.set(key, def);
            return def ?? null;
        }
    }
    has(key){
        return !!this.#logs[key];
    }
    push(val){
        return this.#logs.push(val);
    }
    splice(index, amt){
        return this.#logs.splice(index, amt);
    }
    sort(fn){
        return this.#logs.sort(fn);
    }
    filter(fn){
        return this.#logs.filter(fn);
    }
    save(){
        this.#f.write(this.dir, JSON.stringify(this.#logs))
    }
    get length(){
        if( Array.isArray(this.#logs)){
            return this.#logs.length;
        } else {
            return Object.keys(this.#logs).length;
        }
    }
    get logs(){
        return this.#logs;
    }
    toJson(){
        let _ = {};
        for( let i = 0; i < this.#logs.keys().length; i++){
            _[this.#logs.keys()[i]] = this.#logs.get(this.#logs.keys()[i]);
        }
        return _;
    }
    constructor( f, options, dir, logs){
        this.dir = dir; // Store the directory path as a public property
        this.#f = f;
        this.#logs = logs || {};

        if(options.persistent_save) {
            // If the options object has a persistent_save property,
            // override the set and delete methods to save the data after each modification operation
            this.set = (key, value) => {
                this.#logs[key] = value;
                this.save();
                return value;
            }
            let del = this.delete;
            this.delete = (key) => {
                if(this.#logs[key]) delete this.#logs[key];
                this.save();
                return 1
            }
            this.push = (val)=>{
                this.#logs.push(val);
                this.save();
                return 1;
            }
        }
    }
}
class Database{
    #f;
    #_children;
    #_e = {};
    #entries = new Map();
    get( name, options = {persistent_save: false}, def = '{}'){
        name = name.toString().replaceAll(" ","_").replaceAll(":",".")
        if(this.#entries.has(name)) return this.#entries.get(name);
        if( this.#f.isFile(this.dir+`/${name}.json`, false)) { // file FOUND!
            this.#entries.set( name, new Entry( this.#f, options, this.dir+`/${name}.json`, JSON.parse(this.#f.open(this.dir+`/${name}.json`, false).read( false))));
            return this.#entries.get(name);
        } else {
            this.#f.create(this.dir+`/${name}.json`, def, false);
            this.#entries.set( name, new Entry( this.#f, options, this.dir+`/${name}.json`, def === '{}' ? {} : []));
            return this.#entries.get(name);
        }
    }
    has( name){
        return this.#f.isFile(this.dir+`/${name}.json`);
    }
    remove( name){
        if( !this.has( name)) return 1;
        return this.#f.remove(this.dir+`/${name}.json`)
    }
    toJson(){
        return this.#_e;
    }
    constructor( f, dir, children){
        this.dir = dir;
        this.#f = f;
        this.#_children = children;
    }
}
class DatabaseModule {
    #f;
    #loaded = new Map();
    #logger;
    deleteDatabase( databaseName){
        this.#f.remove( `./db/${databaseName}`);
    }
    getDatabase( databaseName){
        if(this.#loaded.has( databaseName)) return (this.#loaded.get( databaseName))
        return new Promise( async (resolve, reject)=>{

            if(this.#f.isFile(`./db/${databaseName}`)){ // DB Exists
                this.#loaded.set( databaseName, new Database( this.#f, `./db/${databaseName}`, []));
                resolve(this.#loaded.get( databaseName));
            } else { // New DB
                this.#f.mkDir( `./db/${databaseName}`, false);
                this.#loaded.set( databaseName, new Database( this.#f, `./db/${databaseName}`, this.#f.listDir(`./db/${databaseName}`)));
                resolve(this.#loaded.get( databaseName));
            }
            reject({error:-1,msg:"???"});
        })
    }
    constructor(m){
        this.modules = m;
        this.#f = m.get('FileSystem');
        this.#f.isFile("./db")
            .then(present=>present && this.#f.mkDir("./db"))
            .finally(()=>{
                this.#logger = m.get("Logger");
            })
    }
}
let Module = {
    type: "class",
    exports: DatabaseModule
}
export {Module};