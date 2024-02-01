class file{
    #fs;
    read( async = true, callback = (err)=>{if(err) throw new Error(err)}){
        if(!async)
            return this.#fs.readFileSync( this.fileName);
        else return new Promise((resolve, reject)=>{
            this.#fs.readFile( this.fileName, callback)
                .then(v=>resolve(v))
                .catch(err=> reject(err))
        })
    }
    write( data, async = true, callback = (err)=>{if(err) throw new Error(err)}){
        if(!async)
            return this.#fs.writeFileSync( this.fileName, data, 'utf8');
        else return new Promise((resolve, reject) => {
            this.#fs.writeFile( this.fileName, data, "utf8", callback)
                .then(v=>resolve(v))
                .catch(err=> reject(err))
        })
    }

    append( content, async = true){
        if(!async)
            return this.#fs.appendFileSync( this.fileName, content);
        else
            return new Promise( (resolve,reject)=>{
                this.#fs.appendFile( this.fileName, content, callback)
                    .then(v=>resolve(v))
                    .catch(err=>reject(err));
        })
    }
    constructor( fs, fileName){
        this.#fs = fs;
        this.fileName = fileName;
    }
}
class fileSystem{
    #fs;
    open( fileName, async = true, callback = (err)=>{if(err) throw new Error(err)}){
        if(!async) {
            if (this.isFile(fileName, false)) {
                return new file(this.#fs, fileName);
            } else {
                this.create(fileName, false);
            }
        }
        else {
            return new Promise((resolve, reject)=>{
                this.isFile( fileName, true, (err)=>console.error(err))
                    .then(v=>{
                        if(v) resolve(new file( this.#fs, fileName));
                        this.create( fileName, true)
                            .then(()=>resolve(new file( this.#fs, fileName)))
                            .catch(err=>callback(err));
                    });
            })

        }
    }
    write( fileName, data, async = true, callback = (err)=>{if(err) throw new Error(err)}){
        if(!async)
            return this.#fs.writeFileSync( fileName, data, 'utf8');
        else return new Promise((resolve, reject) => {
            this.#fs.writeFile( fileName, data, "utf8", callback)
                .then(v=>resolve(v))
                .catch(err=> reject(err));
        })
    }
    read( fileName, async = true, callback = (err) =>{if(err) throw new Error(err)}){
        if(!async)
            return this.#fs.readFileSync( fileName);
        else return new Promise((resolve, reject)=>{
            this.#fs.readFile( fileName, callback)
                .then(v=>resolve(v))
                .catch(err=> reject(err));
        })
    }
    isFile( fileName, async = true, callback = (err)=>{if(err) throw new Error(err)}){
        if(!async)
            return this.#fs.existsSync( fileName);
        else return new Promise((resolve,reject)=>{
            this.#fs.exists(fileName, (there)=>{
                if(there) resolve(1)
                else resolve(-1);
            })
        })
    }
    mkDir( dir, async = true, callback = (err)=>{if(err) throw new Error(err)}){
        if(!async)
            return this.#fs.mkdirSync( dir);
        else return new Promise((resolve, reject)=>{
            this.#fs.mkdir( dir, { recursive: true }, (err)=>{
                if(err) resolve(-1)
                else resolve(1);
            })
        })
    }
    listDir( dir, async = true, callback = (err)=>{if(err) throw new Error(err)}){
        if(!async)
            return this.#fs.readdirSync( dir);
        else return new Promise((resolve, reject)=>{
            this.#fs.readdir( dir, callback)
                .then(v=>resolve(v))
                .catch(err=> reject(err));
        })
    }
    rename( dir, newDir, async = true, callback = (err)=>{if(err) throw new Error(err)}){
        // Rename Override Safeguard
        if(this.#fs.existsSync(`./${newDir}`)) {
            let newIndex = 0;
            while(this.#fs.existsSync(`./${newDir}_old_${newIndex}`)){
                newIndex++;
            }
            this.#fs.renameSync(`./${newDir}`, `./${newDir}_old_${newIndex}`)
        }
        if(!async)
            return this.#fs.renameSync(`./${dir}`, `./${newDir}`);
        else return new Promise((resolve, reject)=>{
            this.#fs.rename( dir, newDir, callback)
                .then(v=>resolve(v))
                .catch(err=> reject(err));
        })
    }
    create( name, def = "", async = true, callback = (err)=>{if(err) throw new Error(err)}){
        if(!async)
            return this.#fs.writeFileSync( name, def);
        else return new Promise((resolve, reject)=>{
            this.#fs.writeFile( name, def, callback)
                .then(v=>resolve(v))
                .catch(err=> reject(err));
        })
    }
    remove( name, async = true, callback = (err)=>{if(err) throw new Error(err)}){
        if(!async)
            return this.#fs.unlinkSync( name);
        else return new Promise((resolve, reject)=>{
            this.#fs.unlink( name, callback)
                .then(v=>resolve(v))
                .catch(err=> reject(err));
        })
    }
    constructor( modules){
        this.modules = modules;
        this.#fs = this.modules.get('fs');
    }
}
let Module = {type:"class"};
Module.exports = fileSystem;
export {Module};