import * as jose from "node-jose";
import * as fs from "fs";
import * as path from "path";

const keystore = jose.JWK.createKeyStore();
keystore.generate("oct", 512, { use: "sig" }).
    then(function (result) {
        const key: jose.JWK.Key = result;
        const jsonObj = key.toJSON(true);
        const jsonContent = JSON.stringify(jsonObj, null, 2);

        const keyPath = path.resolve(__dirname, "JWK.json");

        fs.writeFile(keyPath, jsonContent, 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }
            console.log(`JWK saved at: ${keyPath}`);
        }); 
    });
