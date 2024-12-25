const http=require("http");
const fs=require("fs");

const server=http.createServer((req,res)=>{
    const url=req.url;
    const method=req.method;

    if(req.url=='/'){
        res.setHeader("Content-type",'text/html');
        fs.readFile("DataStore.txt",(err,data)=>{
            let display=data.toString();
            res.end(
                `<form action="/message" method="POST">
                    <p>${display}</p>
                    <input type="text" name="displaydata"></input>
                    <button type="submit">Send</button>
                </form>`
            )
        })
    } else{
        if(req.url=="/message"){
            res.setHeader("Content-Type","text/html");
            let datachunks=[];
            req.on('data',(chunks)=>{
                //console.log(chunks);
                datachunks.push(chunks);
            })

            req.on('end',()=>{
                let combinedBuffer=Buffer.concat(datachunks);
                let value=combinedBuffer.toString().split("=")[1];
                //console.log(value);

                fs.writeFile("DataStore.txt",value,(err)=>{

                    res.statusCode=302; //redirected
                    res.setHeader("Location","/");
                    res.end();
                })
            })
        }
    }
})

server.listen(3300,()=>{
    console.log("Server checked");
})