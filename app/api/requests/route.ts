import { NextResponse } from "next/server"

let requests:any[] = []

export async function GET() {
  return NextResponse.json(requests)
}

export async function POST(req: Request) {

  const data = await req.json()

  requests.push(data)

  const BOT_TOKEN = "8539894941:AAEYZO0YZvc90z5svYf5NOoXbh0f6Bl0Fh4"
  const CHAT_ID = "1084236547"

  const message = `
<b>📡 НОВАЯ ЗАЯВКА IDA TV</b>

<b>👤 Клиент:</b> ${data.firstName} ${data.lastName}

<b>📞 Телефон:</b> ${data.phone}
<b>📧 Email:</b> ${data.email}

<b>🏙 Город:</b> ${data.city}
<b>📍 Адрес:</b> ${data.address}

<b>⚙ Подключение:</b> ${data.connection}
<b>📺 Устройств:</b> ${data.devices}
<b>💻 Тип:</b> ${data.deviceType}
`

  try {

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        chat_id:CHAT_ID,
        text:message,
        parse_mode:"HTML"
      })
    })

  } catch (error) {

    console.log("Telegram error",error)

  }

  return NextResponse.json({success:true})
}