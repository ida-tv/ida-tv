import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {

try{

const clients = await prisma.client.findMany({
orderBy:{id:"desc"}
})

return Response.json(clients)

}catch(e){

console.error("Ошибка GET /api/clients", e)

return new Response(
JSON.stringify({error:"Ошибка сервера"}),
{status:500}
)

}

}

export async function POST(req:Request){

try{

const data = await req.json()

const client = await prisma.client.create({

data:{
name:data.name,
phone:data.phone,
address:data.address,
email:data.email,
nick:data.nick,
invoiceNr:data.invoiceNr,
price:Number(data.price),
month:data.month,
status:data.status,
comment:data.comment
}

})

return Response.json(client)

}catch(e){

console.error("Ошибка POST /api/clients", e)

return new Response(
JSON.stringify({error:"Ошибка добавления"}),
{status:500}
)

}

}

export async function PUT(req:Request){

try{

const data = await req.json()

await prisma.client.update({

where:{id:Number(data.id)},

data:{
name:data.name,
phone:data.phone,
address:data.address,
email:data.email,
nick:data.nick,
invoiceNr:data.invoiceNr,
price:Number(data.price),
month:data.month,
status:data.status,
comment:data.comment
}

})

return Response.json({ok:true})

}catch(e){

console.error("Ошибка PUT /api/clients", e)

return new Response(
JSON.stringify({error:"Ошибка обновления"}),
{status:500}
)

}

}