import { NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {

  const { id } = await context.params

  try {

    await prisma.client.delete({
      where: { id: Number(id) }
    })

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    )

  } catch (error) {

    console.error("DELETE ERROR:", error)

    return new Response(
      JSON.stringify({ error: "Delete failed" }),
      { status: 500 }
    )

  }

}