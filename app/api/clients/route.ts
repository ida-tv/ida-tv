import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"


// получить клиентов
export async function GET() {
  try {

    const clients = await prisma.client.findMany({
      orderBy: { id: "desc" }
    })

    return NextResponse.json(clients)

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Ошибка загрузки" },
      { status: 500 }
    )
  }
}



// добавить клиента
export async function POST(req: Request) {
  try {

    const data = await req.json()

    const client = await prisma.client.create({
      data: {
        name: data.name,
        phone: data.phone,
        address: data.address,
        email: data.email,
        nick: data.nick,
        price: Number(data.price || 0),
        month: data.month,
        status: data.status,
        comment: data.comment
      }
    })

    return NextResponse.json(client)

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Ошибка сохранения" },
      { status: 500 }
    )
  }
}



// редактировать клиента
export async function PUT(req: Request) {
  try {

    const data = await req.json()

    const client = await prisma.client.update({
      where: {
        id: Number(data.id)
      },
      data: {
        name: data.name,
        phone: data.phone,
        address: data.address,
        email: data.email,
        nick: data.nick,
        price: Number(data.price || 0),
        month: data.month,
        status: data.status,
        comment: data.comment
      }
    })

    return NextResponse.json(client)

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Ошибка обновления" },
      { status: 500 }
    )
  }
}



// удалить клиента
export async function DELETE(req: Request) {
  try {

    const data = await req.json()

    await prisma.client.delete({
      where: {
        id: Number(data.id)
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Ошибка удаления" },
      { status: 500 }
    )
  }
}