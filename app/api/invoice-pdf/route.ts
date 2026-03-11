import PDFDocument from "pdfkit"

export async function POST(req:Request){

const data = await req.json()

return new Promise((resolve)=>{

const doc = new PDFDocument({margin:50})

let buffers:any[]=[]

doc.on("data",(b)=>buffers.push(b))

doc.on("end",()=>{

const pdf = Buffer.concat(buffers)

resolve(new Response(pdf,{
headers:{
"Content-Type":"application/pdf",
"Content-Disposition":`attachment; filename=invoice-${data.invoiceNr}.pdf`
}
}))

})

doc.fontSize(24).text("IDA TV",{align:"center"})
doc.moveDown()

doc.fontSize(16).text("ARVE / INVOICE",{align:"center"})
doc.moveDown()

doc.fontSize(12)

doc.text(`Arve nr: ${data.invoiceNr}`)
doc.text(`Дата счета: ${new Date().toLocaleDateString()}`)

const due = new Date()
due.setDate(due.getDate()+7)

doc.text(`Срок оплаты: ${due.toLocaleDateString()}`)

doc.moveDown()

doc.text(`Клиент: ${data.name}`)
doc.text(`Телефон: ${data.phone}`)
doc.text(`Адрес: ${data.address}`)

if(data.nick){
doc.text(`Nick: ${data.nick}`)
}

doc.moveDown()

doc.text(`IPTV подписка — ${data.month}`)

doc.moveDown()

doc.fontSize(14).text(`Сумма к оплате: ${data.price} €`,{align:"right"})

doc.moveDown()
doc.moveDown()

doc.fontSize(14).text("Реквизиты для оплаты",{underline:true})

doc.moveDown()

doc.fontSize(12)

doc.text("Имя получателя: Artjom Fjodorov")
doc.text("Panga nimi: LHV")
doc.text("IBAN: EE557700771009771245")

doc.moveDown()

doc.text(`В пояснение платежа укажите: Arve nr ${data.invoiceNr}`)

doc.moveDown()
doc.moveDown()

doc.text("Уважаемый клиент,")
doc.moveDown()

doc.text("Мы выставили вам счет от IDA TV за подписку на следующий год.")
doc.text("Если у вас есть вопросы или нужна дополнительная информация, обращайтесь к нам.")
doc.text("Мы готовы помочь в любое время.")

doc.moveDown()
doc.moveDown()

doc.text("Info")
doc.text("E-mail: setuptv@mail.ee")
doc.text("Tel: +37258041259")

doc.end()

})

}