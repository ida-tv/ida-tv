import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { id: "desc" }
    })

    return NextResponse.json(clients)

  } catch (error) {
    console.error("GET clients error:", error)

    return NextResponse.json(
      { error: "Ошибка загрузки" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()

    const client = await prisma.client.create({
      data: {
        name: data.name || "",
        phone: data.phone || "",
        address: data.address || "",
        email: data.email || "",
        nick: data.nick || "",
        price: Number(data.price || 0),
        month: data.month || "",
        status: data.status || "не оплачено",
        comment: data.comment || ""
      }
    })

    return NextResponse.json(client)

  } catch (error) {
    console.error("POST client error:", error)

    return NextResponse.json(
      { error: "Ошибка сохранения" },
      { status: 500 }
    )
  }
}