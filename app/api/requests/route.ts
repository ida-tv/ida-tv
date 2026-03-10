import { NextResponse } from "next/server"

let requests:any[] = []

export async function POST(req:Request){

const data = await req.json()

requests.push(data)

const message = `
Новая заявка IDA TV

Имя: ${data.firstName}
Фамилия: ${data.lastName}
Телефон: ${data.phone}
Email: ${data.email}
Город: ${data.city}

Тип подключения: ${data.connection}
Количество устройств: ${data.devices}
Тип устройства: ${data.deviceType}
`

await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
chat_id:process.env.TELEGRAM_CHAT_ID,
text:message
})
})

return NextResponse.json({success:true})

}

export async function GET(){

return NextResponse.json(requests)

}