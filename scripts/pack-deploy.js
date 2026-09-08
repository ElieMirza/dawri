const fs=require("fs");
const path=require("path");
const root="/workspace/dawri";
const skip=new Set(["node_modules","dist",".expo",".git","_deploy_files","_parts","scripts"]);
const textExt=new Set([".ts",".tsx",".js",".jsx",".json",".md",".txt",".html",".css"]);
function walk(d,acc=[]){for(const ent of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,ent.name);if(ent.isDirectory()){if(!skip.has(ent.name))walk(p,acc);}else acc.push(p);}return acc;}
const files=[];
for(const p of walk(root)){
  const rel=path.relative(root,p).split(path.sep).join("/");
  if(rel.startsWith("scripts/")) continue;
  if(rel.startsWith("_")) continue;
  if(rel.endsWith(".wrap")) continue;
  if(/^(f[0-9]|one_|CALL|mcp_|full_|deploy_|src\.b64|unpack_)/.test(rel)) continue;
  const allow=["app/","assets/","components/","constants/","context/","data/","hooks/","i18n/","package.json","app.json","tsconfig.json","vercel.json","eas.json",".gitignore"];
  if(!allow.some(a=>rel===a||rel.startsWith(a))) continue;
  const ext=path.extname(p).toLowerCase();
  const buf=fs.readFileSync(p);
  if(textExt.has(ext)||rel==="vercel.json"||rel===".gitignore"){
    try { files.push({file:rel,data:buf.toString("utf8"),encoding:"utf-8"}); }
    catch(e){ files.push({file:rel,data:buf.toString("base64"),encoding:"base64"}); }
  } else {
    files.push({file:rel,data:buf.toString("base64"),encoding:"base64"});
  }
}
fs.writeFileSync(path.join(root,"_files_only.json"), JSON.stringify({files}));
console.log(files.length);
