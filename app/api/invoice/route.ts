html: `
<h2>IDA TV</h2>

<p><b>Arve nr:</b> ${data.invoiceNr}</p>
<p><b>Дата счета:</b> ${new Date().toLocaleDateString()}</p>
<p><b>Срок оплаты:</b> ${new Date(Date.now() + 7*24*60*60*1000).toLocaleDateString()}</p>

<hr/>

<p><b>Клиент:</b> ${data.name}</p>
<p><b>Адрес:</b> ${data.address}</p>

<p><b>Месяц:</b> ${data.month}</p>
<p><b>Сумма:</b> ${data.price} €</p>

<hr/>

<p>Просим оплатить счет до указанной даты.</p>

<p>С уважением<br/>
IDA TV</p>
`