import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function DELETE(
request: Request,
{ params }: { params: Promise<{ id: string }> }
){

try{

const { id } = await params

await prisma.client.delete({
where:{
id: Number(id)
}
})

return Response.json({success:true})

}catch(error){

console.log("DELETE ERROR:", error)

return new Response("Delete error",{status:500})

}

}