import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {

  await prisma.client.delete({
    where: {
      id: Number(params.id)
    }
  })

  return Response.json({ success: true })

}