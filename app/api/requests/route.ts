import { NextResponse } from "next/server"

export async function POST(req: Request) {

  try {

    const data = await req.json()

    const message =
`Новая заявка IDA TV

Имя: ${data.firstName}
Фамилия: ${data.lastName}
Телефон: ${data.phone}
Email: ${data.email}
Город: ${data.city}
Услуга: ${data.connection}
Устройства: ${data.devices}
Тип устройства: ${data.deviceType}`

    const response = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: message
        })
      }
    )

    const result = await response.json()

    console.log("Telegram response:", result)

    return NextResponse.json({ success: true })

  } catch (error) {

    console.error("Telegram error:", error)

    return NextResponse.json({ success:false })

  }

}