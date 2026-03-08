import { NextResponse } from "next/server"

export async function GET() {

  const token = process.env.TELEGRAM_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  const url = `https://api.telegram.org/bot${token}/sendMessage`

  await fetch(url,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: "TEST IDA TV 🚀"
    })
  })

  return NextResponse.json({status:"ok"})
}