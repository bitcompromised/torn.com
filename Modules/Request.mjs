// Update to use callback instead of async to
class Request{
    #http;
    #https;
    get( Address){
        return new Promise( (resolve, reject)=>{
            let data = "";
            let get = this[Address.match(/(\w+):\/\//g)[0].replace("://","")].get;
            get( Address, (res)=>{
                const { statusCode } = res;
                const contentType = res.headers['content-type'];

                let error;

                if (statusCode !== 200) {
                    error = new Error('Request Failed.\n' +
                        `Status Code: ${statusCode}`);
                } else if (!/^application\/json/.test(contentType)) {
                    error = new Error('Invalid content-type.\n' +
                        `Expected application/json but received ${contentType}`);
                }
                if (error) {
                    res.resume();
                    reject({error:{error:statusCode, message: error.message}});
                }
                res.on("data", (chunk)=>{
                    data += chunk;
                })
                res.on('end', ()=>{
                    //console.log(data);
                    try{
                        resolve(JSON.parse(data));
                    } catch(err){
                        resolve(data);
                    }
                }).on('error',(e)=>{
                    let error = {
                        error : statusCode,
                        function : "(Class Request).get().on('error',(e)=> this",
                        reason : e.message,
                    };
                    console.debug(error);
                    resolve({error: { error: -1, message: e}});
                })
            })
        })
    }
    constructor(modules){
        this.modules = modules;
        this.http = this.modules.get("http");
        this.https = this.modules.get("https");
    }
}

let Module = {
    type: "class",
    exports: Request,
}
export { Module }