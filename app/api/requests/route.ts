import { NextResponse } from "next/server"

export async function POST(req: Request) {

  const data = await req.json()

  const message = `
Новая заявка IDA TV

Имя: ${data.firstName}
Фамилия: ${data.lastName}
Телефон: ${data.phone}
Email: ${data.email}
Город: ${data.city}
Услуга: ${data.connection}
Устройства: ${data.devices}
Тип устройства: ${data.deviceType}
`

  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      chat_id:process.env.TELEGRAM_CHAT_ID,
      text:message
    })
  })

  return NextResponse.json({ success:true })
}