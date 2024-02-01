class Authenticator{
    #db;
    #http;
    #crypt;
    #payments;
    async #g(){
        return this.#db;
    }
    async validate( Key){
        return 1;
        let userProfile = await this.#http.get(`https://api.torn.com/user/0?selections=&key=${Key}&comment=AttackListAuthenticator`);
        if( userProfile.error) // If I cant get the User profile from the key, there is a problem
            return -1;
        let playerId = userProfile.player_id;
        if(this.#db.has( playerId)){ // If this User has a subscription
            if(new Date(this.#db.get( playerId).expr) >= new Date( Date.now())){ // if the expiration date is in the future
                return 1; // User Authorized
            } else {
                return 0; // User Invalid
            }
        } else { // Create Temporary Residency
            let entry = {
                expr: Date.now() + 3.5*24*60*60*1000, // 3.5day temp
                //Key,
                sharekey: null,
            }
            this.#db.set(playerId, entry); // Save the User's Residency
            return 1;
        }
    }
    InitPaymentSystem(){
        return new Promise(async()=>{
            while(true){
                // Here I am creating a perminant loop. this will continue as long as the program is active
                let curLogs = this.#http.get("https://api.torn.com/user/0?selections=newevents&key=15GFI7BPHyNnrnQW&comment=AttackListAdminPaymentSystem")
                    .then(res=>{
                        for(const event in res.events){
                            let Event = res.events[event];
                            let payment_hash = event;
                            let timestamp = Event.timestamp;
                            let user = Event.event.match(/>(\w+)</g)[0].replace(">","").replace("<","");
                            let message = Event.event.match(/\w+ \d+ x \w+/g)[0];
                            let data = {
                                payment_hash,
                                timestamp,
                                user,
                                message
                            }
                            if(message.match(/\w+/g)[0] === "sent" && message.match(/x \w+/g)[0].replace("x ", "") === "xanax" && !this.#payments.has( payment_hash)){
                                let time = message.match(/\d+/)[0]* 14*24*60*60*1000; // 14 days
                                let id = Event.event.match(/XID=\d+/g)[0].replace("XID=", "")
                                this.#payments.set( payment_hash, data);
                                if(this.#db.has(id)){
                                    let entry = this.#db.get(id);
                                    if(entry.expr < Date.now()){
                                        entry.expr = Date.now() + time;
                                        this.#db.set(id, entry);
                                    } else {
                                        entry.expr += time;
                                        this.#db.set(id, entry);
                                    }
                                } else { // Create new USER based on Payment
                                    let entry = {
                                        expr: Date.now()+ time,
                                        sharekey: null
                                    }
                                    this.#db.set(id, entry);
                                }
                            }
                        }
                    })
                await new Promise((r)=>setTimeout(r, 15 *1000*60)) // 15 Minutes
                // Here I am waiting 15 minutes before re-running the previous check ( to prevent consecutive runs )
            }
        })

    }
    constructor( m, userdb, paymentdb){
        this.m = m; // Honestly, only useful for a bug hack in Loader.mjs Auth->Torn Method
        /*
        this.get("Authenticator")
          .then(async (m)=>{
            // This RIGHT HERE is causing a Database Error.
            // The error contains the fact that invalid databases are no self-initializing synctually.
            this.get("Torn", (await m.m.get("Database").getDatabase("targets")).get("users", {persistent_save: false}, '[]'))
         */
        this.#http = m.get("Request");
        this.#crypt = m.get("Crypt");
        this.#db = userdb;
        this.#payments = paymentdb;
    }
}
let Module = {
    type: "class",
    exports: Authenticator
}
export { Module }