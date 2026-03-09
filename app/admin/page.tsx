export default function AdminPage() {

const requests = [
{
name:"Иван",
phone:"+372000000",
email:"ivan@mail.ee",
city:"Таллин",
connection:"Плейлист",
devices:"2",
status:"Новая"
},
{
name:"Мария",
phone:"+372111111",
email:"maria@mail.ee",
city:"Нарва",
connection:"Удаленная Настройка",
devices:"1",
status:"В Работе"
}
]

return (

<div style={{
minHeight:"100vh",
background:"#0f172a",
color:"#fff",
padding:"40px",
fontFamily:"Arial"
}}>

<h1 style={{fontSize:"32px",marginBottom:"10px"}}>
IDA TV Admin
</h1>

<p style={{color:"#94a3b8"}}>
Панель Управления Заявками
</p>

<div style={{
marginTop:"30px",
background:"#1e293b",
padding:"20px",
borderRadius:"10px"
}}>

<h2 style={{marginBottom:"20px"}}>
Список Всех Заявок
</h2>

<table style={{
width:"100%",
borderCollapse:"collapse"
}}>

<thead style={{background:"#334155"}}>

<tr>

<th style={{padding:"10px"}}>Имя Клиента</th>
<th>Телефон</th>
<th>E-mail</th>
<th>Город</th>
<th>Тип Подключения</th>
<th>Количество Устройств</th>
<th>Статус Заявки</th>

</tr>

</thead>

<tbody>

{requests.map((r,i)=>(
<tr key={i} style={{textAlign:"center"}}>

<td style={{padding:"10px"}}>{r.name}</td>
<td>{r.phone}</td>
<td>{r.email}</td>
<td>{r.city}</td>
<td>{r.connection}</td>
<td>{r.devices}</td>
<td style={{
color:r.status==="Новая"?"#22c55e":"#f59e0b"
}}>
{r.status}
</td>

</tr>
))}

</tbody>

</table>

</div>

</div>

)
}