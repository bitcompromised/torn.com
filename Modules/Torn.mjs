function rand( lowest, highest){
    var adjustedHigh = (highest - lowest) + 1;
    return Math.floor(Math.random()*adjustedHigh) + parseFloat(lowest);
}
let Module = {
    type: "class"
}
Module.exports = class{
    #request
    #userDatabase
    #modules
    save( Path='./data/targetsSaveTest.json'){

    }
    Scrape( startingIndex, key){
        /*let resolver;
        new Promise(async (r)=>{
            resolver = r;
            for(;;){
                let user = await this.#https.get(`https://api.torn.com/user/${ startingIndex++}?selections=&key=${key}`);
                if(!user.error){
                    let tbs = await this.#http.get(`http://www.lol-manager.com/api/battlestats/egMk6ku6yqJkR5mc/2141622/7.6`);
                    if(typeof(tbs) !== 'object')
                        if(toString(tbs).match('error')) {
                            console.log(user.id, tbs);
                            continue;
                        }
                    let entry = {
                        name: user.name,
                        level: user.level,
                        awards: user.awards,
                        age: user.age,
                        honor: user.honor,
                        updated: Date.now(),
                        total: (tbs.TBS_Raw + tbs.TBS + tbs.TBS_Balanced)/3
                    }
                    this.#list.push(entry);
                    this.#list.save();
                } else if( user.error.code === 6){

                }
            }
        })
        while(!resolver){};
        return resolver;*/
    }
    parse( List){
        /*
        List.forEach(user=>{
            if(user.name === 'Javus') return;
            let target = {
                name: user.name,
                age: user.age,
                id: user.id,
                level: user.level,
                awards: user.awards,
                addr: user.addr,
                total: user.prediction.total,
            }
            if(user.prediction.total === 0){
                this.duds.push(target)
            } else {
                if(this.users.filter(t=>t.id === user.id)[0]) return;
                this.users.push(target);
            }
        })
        this.duds.save();
        //this.users.save();
        console.log("Done Parsing");
         */
    }
    get( Amt = 1, Max = 1, Min = 1, key = null) {
        /*
        return new Promise( async (resolve, reject)=>{
            let active_list = [];
            let filtered_list = this.#valid.filter(target=> target.total < Max && target.total > Min)
                .sort((a,b)=>a.awards-b.awards);
            for(let i = 0; i < filtered_list.length; i++){
                let target = filtered_list[i];
                try{
                    let u2d = await this.#http.get(`https://api.torn.com/user/${ target.id}?selections=&key=${key}&comment=AttackListUpToDateCheck`);
                    //let u2d = {error:{code:2}};
                    if(u2d.error){ if(u2d.error.code === 2)  reject({error:{id:2,error:"Incorrect Key"}});if(u2d.error.code === 6) break; continue;}
                    if(!target.age || u2d.age-target.age > 30) { // Update info every x days
                        let listObj = this.#list.logs[this.#list.logs.indexOf(target)];
                        listObj.age = u2d.age;
                        let tbs = await new Promise((r)=>{
                            this.#http.get({
                                host: `www.lol-manager.com`,
                                port: 80,
                                path: `/api/battlestats/egMk6ku6yqJkR5mc/${ root[user].id}/8.9.3/`,
                                method: 'GET',
                            }, (res) => {
                                var data = [];
                                res.on("data", chunk=>{
                                    data.push( chunk)
                                })
                                res.on( "end", ()=>{
                                    try {
                                        if (JSON.parse(Buffer.concat(data).toString())) {
                                            r(JSON.parse(Buffer.concat(data).toString()))
                                        }
                                    } catch(err){
                                        r(Buffer.concat(data).toString())
                                    }
                                }).on('error',(e)=>{
                                    console.log("http error", e);
                                })
                            })
                        })
                        if(typeof(tbs) !== 'object')
                            if(tbs.toString().match('error')) {
                                console.log(target.id, tbs);
                                continue;
                            }
                        else
                            listObj.total = (tbs.TBS_Raw + tbs.TBS + tbs.TBS_Balanced)/3
                        this.#list.save();
                    }
                    if(u2d.status.state === "Okay"){
                        active_list.push(target);
                        new Promise(r=>{
                            let t = this.#valid.splice(this.#valid.indexOf(target), 1);
                            setTimeout(r, 3* 60* 1000*60); // 3 minutes to refresh?
                            this.#valid.push(t);
                        })
                    } else {
                        let toWait = Date.now() - u2d.status.until *1000 + (3 * 60 * 60 * 1000);
                        new Promise(async(r)=>{
                            let t = this.#valid.splice(this.#valid.indexOf(target), 1);
                            setTimeout((r)=> {
                                r(this.#valid.push(t));
                            }, toWait ?? 60* 1000*60);
                        })
                    }
                } catch(err){
                    reject(err);
                }
                if(active_list.length >= Amt) return resolve(active_list);
                await new Promise(r=>setTimeout(r, 1000));
            }
            return resolve(active_list);

        })

         */
    }
    async update(){
        /*
            Get Donator[0|1]
            Get role["Civilian"]
            get revivable[0|1]
            get honor[0-9999]
            get activity[
                if( statusPage.donator || statusPage.last_action.status === "Online" || Date.now() - (statusPage.last_action.timestamp*1000)){
                    continue;
                }
            ]
         */
        /*
        let root = this.#list.logs
            .sort((a,b)=>a.total-b.total)
            .filter(Entry=> (!Entry.updated || Date.now()-Entry.updated > 15*24*60*60*1000) || Entry.total <= 0);
        console.log("Updated ", this.#list.logs.filter(Entry => Entry.updated && Date.now()-Entry.updated <= 15*24*60*60*1000 && Entry.total >= 0).length)
        console.log("Updating ", root.length);
        for (const user in root){
            try{
                let Entry = root[user];
                if(Entry.updated && Date.now()-Entry.updated < 15*24*60*60*1000) continue;
                let u2d = await this.http.get(`https://api.torn.com/user/${ root[user].id}?selections=&key=QR1nghu9W1UZM3Zb&comment=AttackListUpdater`);
                if(u2d.error) continue;
                if(!Entry.age || Entry.age - u2d.age > 15){ // Need to Update
                    //console.clear()
                    //console.log(`Updating [${root[user].name}] ${user}/${root.length} Users`)
                    let tbs = await new Promise((r)=>{
                        this.#http.get({
                            host: `www.lol-manager.com`,
                            port: 80,
                            path: `/api/battlestats/egMk6ku6yqJkR5mc/${ root[user].id}/8.9.3/`,
                            method: 'GET',
                        }, (res) => {
                            var data = [];
                            res.on("data", chunk=>{
                                data.push( chunk)
                            })
                            res.on( "end", ()=>{
                                r(JSON.parse(Buffer.concat(data).toString()))
                            }).on('error',(e)=>{
                                console.log("http error", e);
                            })
                        })
                    })
                    if(!tbs) continue;
                    if((tbs.TBS_Raw + tbs.TBS + tbs.TBS_Balanced)/3 > 1){
                        //console.log(`Old: ${Entry.total}, New: ${(tbs.TBS_Raw + tbs.TBS + tbs.TBS_Balanced)/3}`);
                        Entry.total = (tbs.TBS_Raw + tbs.TBS + tbs.TBS_Balanced)/3;
                    }
                    Entry.age = u2d.age;
                    Entry.level = u2d.level;
                    Entry.awards = u2d.awards;
                    Entry.updated = Date.now();
                    this.#list.save();
                }
            } catch(err){
                console.log("Http Error: ", err);
                console.log(`Updating [${root[user].name}] ${user}/${root.length} Users`)
            }
            await new Promise(r=>setTimeout(r, rand(500,2500)));
        }

         */
    }
    async search( data){
        let searchParams = {
            amount: data.amount ? Math.min(Math.max(1, data.amount), 10) : 1,
            min: data.min && data.min > 0 ? data.min : 1,
            max: data.max && data.max > 1 ? data.max : 9e9,
            key: data.key,
        }
        console.log( searchParams);
        let filteredList = [];
        let fullList = this.direct.filter(t=> t.total < searchParams.max && t.total > searchParams.min)
            //.sort((a,b)=> a.awards- b.awards)
        for( const i in fullList){
            if(filteredList.length >= data.amount)
                return filteredList;
            console.log(i);
            let t = fullList[i];
            let statusPage = await this.#request.get(`https://api.torn.com/user/${ t.id}?selections=&key=${ searchParams.key}&comment=AttackListUpToDateCheck`)
            console.log("StatusPage: ", statusPage)
            if( statusPage.error){
                switch( statusPage.error.code){
                    case 2:
                        return {error: { message: "Incorrect Key"}}
                    case 6: // Incorrect user ID
                        continue;
                }
            }
            if(!t.age || statusPage.age - t.age > 30)
                continue; // Should Update...

            if( statusPage.status.state === "Okay"){
                filteredList.push( t);
                continue;
            }
            else if( statusPage.status.state === "Federal") {
                this.direct.splice(fullList.indexOf(t));
                continue;
            }
            else {
                new Promise(async(r)=>{
                    let f = this.direct.splice(fullList.indexOf(t));
                    setTimeout((r)=> {
                        r(this.direct.push(f));                             // d * h * m * s * ms
                    }, Date.now() - statusPage.status.until *1000 + (0 * 3 * 60 * 60 * 1000));
                })
            }
        }
    }
    constructor( Modules, db){
        this.#modules = Modules;
        this.#request = Modules.get("Request");
        this.#userDatabase = db;
        this.direct = db.logs;
    }
}
export {Module};




/*
Get users from Database
Initialize all users to Active
As you encounter a injured or permed user, remove them from the queue (?to readd later), remove from database and save database
 */