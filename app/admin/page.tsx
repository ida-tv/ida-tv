"use client"

import { useEffect, useState } from "react"

export default function AdminPage() {

const [requests,setRequests] = useState<any[]>([])
const [search,setSearch] = useState("")

useEffect(()=>{

async function load(){

try{

const res = await fetch("/api/requests")

if(!res.ok){
 setRequests([])
 return
}

const text = await res.text()

if(!text){
 setRequests([])
 return
}

const data = JSON.parse(text)

setRequests(data)

}catch(e){

setRequests([])

}

}

load()

},[])

const filtered = requests.filter((r:any)=>
 (r?.name || "").toLowerCase().includes(search.toLowerCase()) ||
 (r?.phone || "").includes(search)
)

return (

<div style={{
background:"#0f172a",
minHeight:"100vh",
color:"#fff",
padding:"40px"
}}>

<h1>IDA TV Admin</h1>

<input
placeholder="Поиск клиента..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
style={{
padding:"10px",
marginBottom:"20px",
width:"300px"
}}
/>

<table style={{
width:"100%",
background:"#1e293b"
}}>

<thead>

<tr>

<th>Имя</th>
<th>Телефон</th>
<th>Email</th>
<th>Город</th>
<th>Подключение</th>
<th>Кол-Устройства</th>
<th>Тип устройства</th>
<th>Статус</th>

</tr>

</thead>

<tbody>

{filtered.map((r:any,i:number)=>(

<tr key={i}>

<td>{r.name}</td>
<td>{r.phone}</td>
<td>{r.email}</td>
<td>{r.city}</td>
<td>{r.connection}</td>
<td>{r.devices}</td>
<td>{r.deviceType}</td>

<td>

<select>

<option>Новая</option>
<option>В работе</option>
<option>Готово</option>

</select>

</td>

</tr>

))}

</tbody>

</table>

</div>

)

}