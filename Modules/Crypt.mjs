import crypto from "crypto";

let Module = {
    type: "class",
};


Module.exports = class{
    #crypt;
    #secret;
    encrypt( data, key = this.#crypt.randomBytes(32), iv = this.#crypt.randomBytes(12)){
        let cipher = this.#crypt.createCipheriv('aes-256-gcm', key, iv);
        let ciphertext = cipher.update('Hello, world!', 'utf8');
        ciphertext = Buffer.concat([ciphertext, cipher.final()]);
        let tag = cipher.getAuthTag();
        return {
            key, iv, tag, ciphertext
        }
    }
    decrypt( key, iv, tag, cipher){
        const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(tag);
        let decrypted = decipher.update(cipher, null, 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    createHash( data="default12345", hashMethod="sha256"){
        let hash = this.#crypt.createHash(hashMethod)
        hash.update( data);
        return hash.digest('hex');
    }
    async init(){
        this.#crypt = await this.modules.get("crypto");
        return this;
    }
    constructor(modules, secretKey = "nemoFought1234Doras"){
        this.#secret = secretKey;
        this.modules = modules;
    }
}
export {Module};