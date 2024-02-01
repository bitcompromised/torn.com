// This is the Main "webpage" handler

// Import external code
import Modules from './Modules/Loader.mjs';
import compression from 'compression';
import express from 'express';
import session from 'express-session';

const Loader = await(new Modules)
    .init(); 
    /*
        Initialize modules
            * FileSystem
                * Database
                    * Crypt
                    * Http.Request
                    * Authenticator
                        * Torn API Endpoint
            * Logger
    */

const app = express()
app.use(express.static("Public/Static/Pages"))
    // Display static webpages from a folder. Ex: http://192.168.1.1/index.html -> [index.html] -> [./Public/Static/Pages/index.html]
app.use(compression())
    // Compresses data sent using GZip (Similar to 7Zip/Winrar). Decreases amount of total data packets sent
app.use(session({
    // Saves a user session. If you close your browser, when returning (within cookie.maxAge) certain data (login status) can be maintained
    resave: false,
    saveUninitialized: true,
    secret: 'a1b2c3d4e5f6g7h8i9j0kzlymxnwovpuqtrs',
    cookie: {
        maxAge: 604800000,
    }
}))
app.get('/', async (request, response)=>{
    console.log(Loader.get("Torn").update);
    response.send("This is SOLELY backend API usage. If you are here, please and kindly fuck off, or contact me on discord @nitrazolam");
})
app.get('/scan/:amount/:key', async (request, response)=>{
    // example address google.com/scan/1 || 192.168.1.1/scan/999999
    let data = request.params || JSON.parse( request.body);
    // data you're sending to the client, ex login: {username: "test", password: "KtxA301iSLpvWAx3k1RMZw=="}
    // or {MinimumStats: 10, MaximumStats: 9e9}
    switch( await Loader.get("Authenticator").validate( data.key)){
        /*
            Authenticator.validate ( Key):
                ~Get authentication status of a User based on their API Key

                * Http.Request User Profile to identify true user
                * Locate Database Entry for USER or create temporary residency
         */
        case -1: // Error
            return response.json({ error: {code: 100, error: "Invalid API response" }})
        case 0: // Invalid
            return response.json({ error: {code: 101, error: "Invalid Subscription" }})
        case 1: // Authenticated
            console.log("Authenticated");
            let search = await Loader.get("Torn").search( data);
            if (search.error){
                return response.json( search);
            }
            return response.json( search)
        /*
            Torn.get ( Amount, Data):
                ~Get [Amount] of [not-dead] users in range set in Data variable

                * Sort list of all users where stats < desired, by the highest amount of potential rewards
                    * Query target user profile to check user_health and user_status
                * Return list[Amt] of healthy users
         */
    }
})

app.listen(80, async () => {
    /* app.listen (port, callback=()=>{}):
        ~Listen to a port on your ip.

        For example, if using minecrafts port (25565), you can theoretically _RESPOND_ as a minecraft server.
        you could not 'run' a minecraft server as this is javascript not java, though you could redirect to other programs from here
	based on factors. example: testsite.com -> ( Local Static Webpages) -> Webpage | mc.testsite.com -> ( Redirect to another Port/Program on the same computer) -> Minecraft Server
     */
    console.log(`Server is running on port ${80}`);
});

