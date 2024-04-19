document.write("<div class=\"debug\">Code for log...</div>");

let Logged_currentID = 0;
class Logged {
    messages=[];
    constructor(name) {this.name=name}
    log(m,t,prefix,idParent){
        this.messages.push({id:++Logged_currentID,type:t,msg:m,dt:new Date(),idParent:idParent}); 
        if(t!=null) console.log("/*"+t+"*/");
        if(prefix!=null) m=prefix+m;
        console.log(m);
        return m;
    }
    logerror(m,idParent){ this.log(m,"error",idParent); return m;}
    logurl(m){ this.log(m,"url"); return m;}
    logreq(m,idUrl){ this.log(JSON.parse(m),"req",idUrl); return m;}
    logresp(m,idReq){ this.log(JSON.parse(m),"resp",idReq); return m;}
    dumpCurl(){
        let r = "";
        this.messages.forEach((e)=>
        {
            if (e.type=="url") r+="curl "+e.msg+" \\\n-H \"Content-Type: application/json\" \\\n-H \"Authorization: Bearer $OPENAI_API_KEY\" \\";
            else if (e.type=="req") r+="\n-d '"+JSON.stringify(e.msg)+"'\n";
        });
    }
    dump(){ this.messages.forEach((e)=>{console.log(e.dt);});}
}

document.write("<div class=\"debug\">End of Code for log.</div>");