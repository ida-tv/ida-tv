import nodemailer from "nodemailer"

export async function POST(req: Request){

try{

const data = await req.json()

const transporter = nodemailer.createTransport({

host: process.env.EMAIL_HOST,
port: Number(process.env.EMAIL_PORT),
secure: false,

auth:{
user: process.env.EMAIL_USER,
pass: process.env.EMAIL_PASS
}

})

await transporter.sendMail({

from: `"IDA TV" <${process.env.EMAIL_USER}>`,
to: data.email,

subject: `IDA TV Arve nr ${data.invoiceNr}`,

html: `
<h2>IDA TV</h2>

<p><b>Arve nr:</b> ${data.invoiceNr}</p>
<p><b>Сумма:</b> ${data.price} €</p>

<hr>

<h3>Реквизиты для оплаты</h3>

<p>Имя получателя: Artjom Fjodorov</p>
<p>Panga nimi: LHV</p>
<p>IBAN: EE557700771009771245</p>

<p>В пояснение платежа укажите: Arve nr ${data.invoiceNr}</p>

<hr>

<p>Info</p>
<p>Email: setuptv@mail.ee</p>
<p>Tel: +37258041259</p>
`
})

return Response.json({success:true})

}catch(error){

console.log("EMAIL ERROR:",error)

return Response.json(
{error:"Ошибка отправки Email"},
{status:500}
)

}

}