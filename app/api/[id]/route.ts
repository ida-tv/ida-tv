import { NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

/* ---------------- DELETE CLIENT ---------------- */

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {

  try {

    const id = Number(context.params.id)

    if (!id) {

      return new Response(
        JSON.stringify({ error: "ID not found" }),
        { status: 400 }
      )

    }

    await prisma.client.delete({
      where: { id }
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