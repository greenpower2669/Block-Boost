"use strict";
// Confidential key is encrypted before any GitHub upload. No private JKS in git.
const fs=require("node:fs");
const {randomBytes,pbkdf2Sync,createCipheriv,createDecipheriv,timingSafeEqual}=require("node:crypto");
const [input,output]=process.argv.slice(2),password=process.env.BB_STORE_PASSWORD;
if(!input||!output||!password||password.length<16){
 process.stderr.write("Encryption password is missing or under 16 characters.\n");process.exit(2);
}
const raw=fs.readFileSync(input);
if(raw.length<1000||raw.length>50000)throw Error("Unexpected JKS size");
const salt=randomBytes(16),iv=randomBytes(12);
const key=pbkdf2Sync(password,salt,850000,32,"sha256");
const enc=createCipheriv("aes-256-gcm",key,iv);
const ciphertext=Buffer.concat([enc.update(raw),enc.final()]);
const tag=enc.getAuthTag();
fs.writeFileSync(output,Buffer.concat([
 Buffer.from("BBKEY001"),salt,iv,tag,ciphertext
]),{flag:"wx",mode:0o600});
// Authenticated encryption round-trip verified before publishing ciphertext.
const dec=createDecipheriv("aes-256-gcm",key,iv);dec.setAuthTag(tag);
const check=Buffer.concat([dec.update(ciphertext),dec.final()]);
if(check.length!==raw.length||!timingSafeEqual(check,raw))throw Error("Encryption check failed");
console.log("Encrypted key file and authenticated round-trip verified; no private JKS published.");
