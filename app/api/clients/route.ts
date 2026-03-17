import { NextResponse } from "next/server"
import prisma from "../../../lib/prisma"

// GET
export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { id: "desc" }
    })

    return NextResponse.json(clients)

  } catch (error) {
    console.error("GET error:", error)
    return NextResponse.json([], { status: 200 }) // важно
  }
}

// POST
export async function POST(req: Request) {
  try {
    const data = await req.json()

    const client = await prisma.client.create({
      data: {
        name: data.name,
        phone: data.phone,
        address: data.address,
        email: data.email || null,
        nick: data.nick || null,

        provider: data.provider || null,
        owner: data.owner || null,
        invoiceNr: data.invoiceNr || null,

        price: Number(data.price || 0),
        month: data.month,
        status: data.status || "не оплачено",

        renewalDate: data.renewalDate || null,
        comment: data.comment || null
      }
    })

    return NextResponse.json(client)

  } catch (error) {
    console.error("POST error:", error)
    return NextResponse.json(
      { error: "Ошибка сохранения" },
      { status: 500 }
    )
  }
}

// PUT
export async function PUT(req: Request) {
  try {
    const data = await req.json()

    const client = await prisma.client.update({
      where: { id: data.id },
      data: {
        name: data.name,
        phone: data.phone,
        address: data.address,
        email: data.email || null,
        nick: data.nick || null,

        provider: data.provider || null,
        owner: data.owner || null,
        invoiceNr: data.invoiceNr || null,

        price: Number(data.price || 0),
        month: data.month,
        status: data.status,

        renewalDate: data.renewalDate || null,
        comment: data.comment || null
      }
    })

    return NextResponse.json(client)

  } catch (error) {
    console.error("PUT error:", error)
    return NextResponse.json(
      { error: "Ошибка обновления" },
      { status: 500 }
    )
  }
}

// DELETE
export async function DELETE(req: Request) {
  try {
    const data = await req.json()

    await prisma.client.delete({
      where: { id: data.id }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("DELETE error:", error)
    return NextResponse.json(
      { error: "Ошибка удаления" },
      { status: 500 }
    )
  }
}
