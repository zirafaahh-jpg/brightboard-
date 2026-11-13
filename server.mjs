// Optional secure AI gateway. Keep provider keys on this server, never in browser code.
import http from 'node:http';
const PORT=process.env.AI_GATEWAY_PORT||8787;
const server=http.createServer(async(req,res)=>{
  res.setHeader('Access-Control-Allow-Origin',process.env.ALLOWED_ORIGIN||'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Headers','Content-Type'); res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  if(req.method==='OPTIONS'){res.writeHead(204).end();return;}
  if(req.url==='/health'){res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify({ok:true}));return;}
  if(req.url!='/api/tutor'||req.method!=='POST'){res.writeHead(404).end('Not found');return;}
  let raw=''; for await(const c of req) raw+=c; let body; try{body=JSON.parse(raw)}catch{res.writeHead(400).end('Invalid JSON');return;}
  const provider=process.env.AI_PROVIDER||'ollama';
  try{
    let response;
    if(provider==='ollama'){
      response=await fetch((process.env.OLLAMA_URL||'http://127.0.0.1:11434')+'/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OLLAMA_MODEL||'llama3.2',stream:false,messages:[{role:'system',content:'You are a careful, encouraging visual tutor. Teach in clear numbered steps. Return valid JSON only with keys: title, subject, explanation, steps (array of objects with heading, narration, boardText, diagramMermaid optional), checkpoint (object with question, options array, answerIndex, explanation). Adapt to the requested language and level. Never claim to have read material not provided.'},{role:'user',content:JSON.stringify(body)}]})});
      if(!response.ok) throw new Error('Ollama returned '+response.status); const data=await response.json();
      let content=data.message?.content||''; content=content.replace(/^```(?:json)?\s*/,'').replace(/```$/,'').trim();
      res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify({provider:'ollama',result:JSON.parse(content)})); return;
    }
    if(provider==='openai-compatible'){
      if(!process.env.AI_API_KEY) throw new Error('AI_API_KEY is missing on the server');
      response=await fetch((process.env.AI_BASE_URL||'https://api.openai.com/v1')+'/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+process.env.AI_API_KEY},body:JSON.stringify({model:process.env.AI_MODEL||'gpt-4o-mini',messages:[{role:'system',content:'Return valid JSON only: title, subject, explanation, steps (heading,narration,boardText,optional diagramMermaid), checkpoint (question,options,answerIndex,explanation). Be an accurate, encouraging tutor.'},{role:'user',content:JSON.stringify(body)}],response_format:{type:'json_object'}})});
      if(!response.ok) throw new Error('AI provider returned '+response.status); const data=await response.json(); res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify({provider:'openai-compatible',result:JSON.parse(data.choices[0].message.content)}));return;
    }
    throw new Error('Unsupported AI_PROVIDER. Use ollama or openai-compatible.');
  }catch(e){res.writeHead(503,{'Content-Type':'application/json'}).end(JSON.stringify({error:e.message,setup:'Connect Ollama or configure an OpenAI-compatible provider on the server.'}));}
}); server.listen(PORT,()=>console.log(`AI gateway listening on http://localhost:${PORT}`));
