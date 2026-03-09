"use client"

import { useState } from "react"

type Request = {
  name: string
  phone: string
  email: string
  city: string
  connection: string
  devices: string
  status: string
}

export default function AdminPage() {

const [requests,setRequests] = useState<Request[]>([
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
])

const [search,setSearch] = useState("")
const [filter,setFilter] = useState("Все")

function deleteRequest(index:number){
setRequests(prev => prev.filter((_,i)=> i !== index))
}

function changeStatus(index:number,newStatus:string){

setRequests(prev => {

const updated=[...prev]

updated[index]={...updated[index],status:newStatus}

return updated

})

}

const filteredRequests = requests.filter((r)=>{

const matchSearch =
r.name.toLowerCase().includes(search.toLowerCase()) ||
r.phone.includes(search)

const matchFilter =
filter==="Все" || r.status===filter

return matchSearch && matchFilter

})

return(

<div style={{
background:"#0f172a",
minHeight:"100vh",
padding:"40px",
color:"#fff",
fontFamily:"Arial"
}}>

<h1 style={{fontSize:"32px"}}>IDA TV Admin</h1>

<h2 style={{marginTop:"10px"}}>
Всего Заявок: {requests.length}
</h2>

<div style={{
marginTop:"20px",
display:"flex",
gap:"20px"
}}>

<input
placeholder="Поиск Клиента"
value={search}
onChange={(e)=>setSearch(e.target.value)}
style={{
padding:"10px",
borderRadius:"5px",
border:"none"
}}
/>

<select
value={filter}
onChange={(e)=>setFilter(e.target.value)}
style={{
padding:"10px",
borderRadius:"5px"
}}
>

<option>Все</option>
<option>Новая</option>
<option>В Работе</option>
<option>Завершено</option>

</select>

</div>

<table style={{
width:"100%",
marginTop:"30px",
borderCollapse:"collapse"
}}>

<thead style={{background:"#334155"}}>

<tr>

<th>Имя Клиента</th>
<th>Телефон</th>
<th>E-mail</th>
<th>Город</th>
<th>Тип Подключения</th>
<th>Количество Устройств</th>
<th>Статус Заявки</th>
<th>Действия</th>

</tr>

</thead>

<tbody>

{filteredRequests.map((r,i)=>(

<tr key={i} style={{textAlign:"center"}}>

<td>{r.name}</td>
<td>{r.phone}</td>
<td>{r.email}</td>
<td>{r.city}</td>
<td>{r.connection}</td>
<td>{r.devices}</td>

<td>

<select
value={r.status}
onChange={(e)=>changeStatus(i,e.target.value)}
>

<option>Новая</option>
<option>В Работе</option>
<option>Завершено</option>

</select>

</td>

<td>

<button
onClick={()=>deleteRequest(i)}
style={{
background:"red",
color:"#fff",
border:"none",
padding:"6px 12px",
cursor:"pointer"
}}
>

Удалить

</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

)

}