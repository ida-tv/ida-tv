"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Trash, Pencil, MessageCircle } from "lucide-react"

export default function Admin(){

const router = useRouter()

const [clients,setClients] = useState<any[]>([])
const [search,setSearch] = useState("")
const [monthFilter,setMonthFilter] = useState("all")
const [editingId,setEditingId] = useState<number | null>(null)

const [page,setPage] = useState(1)
const perPage = 20

const [form,setForm] = useState({
name:"",
phone:"",
address:"",
email:"",
nick:"",
provider:"",
owner:"",
invoiceNr:"",
price:"",
month:"",
renewalDate:"",
status:"не оплачено",
comment:""
})

const badge = "border border-blue-500 text-white px-2 py-0.5 text-xs rounded-full whitespace-nowrap"

/* ---------- PAGE RESET ---------- */
useEffect(()=>{ setPage(1) },[search,monthFilter])

/* ---------- LOGIN ---------- */
useEffect(()=>{
const admin = localStorage.getItem("admin")
if(!admin){
router.push("/login")
return
}
loadClients()
},[])

/* ---------- LOAD ---------- */
async function loadClients(){
try{
const res = await fetch("/api/clients",{cache:"no-store"})
const data = await res.json()
if(Array.isArray(data)){
setClients(data)
}else{
setClients([])
}
}catch{
setClients([])
}
}

/* ---------- SAVE ---------- */
async function addClient(){

if(!form.name || !form.phone){
alert("Введите имя и телефон")
return
}

const method = editingId ? "PUT" : "POST"

await fetch("/api/clients",{
method,
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({
id:editingId,
name: form.name,
phone: form.phone,
address: form.address,
email: form.email,
nick: form.nick,
price:Number(form.price || 0),
month: form.month,
renewalDate: form.renewalDate,
status: form.status,
comment: form.comment
})
})

setForm({
name:"",
phone:"",
address:"",
email:"",
nick:"",
provider:"",
owner:"",
invoiceNr:"",
price:"",
month:"",
renewalDate:"",
status:"не оплачено",
comment:""
})

setEditingId(null)
loadClients()

}

/* ---------- EDIT ---------- */
function editClient(c:any){
setForm({
name:c.name || "",
phone:c.phone || "",
address:c.address || "",
email:c.email || "",
nick:c.nick || "",
provider:"",
owner:"",
invoiceNr:"",
price:String(c.price || ""),
month:c.month || "",
renewalDate:c.renewalDate || "",
status:c.status || "не оплачено",
comment:c.comment || ""
})
setEditingId(c.id)
}

/* ---------- DELETE ---------- */
async function deleteClient(id:number){
if(!confirm("Удалить клиента?")) return
await fetch("/api/clients",{
method:"DELETE",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({id})
})
loadClients()
}

/* ---------- FILTER ---------- */
const filtered = (clients || []).filter((c:any)=>{
const value = search.toLowerCase()

const match =
(c.name ?? "").toLowerCase().includes(value) ||
(c.phone ?? "").toLowerCase().includes(value) ||
(c.address ?? "").toLowerCase().includes(value) ||
(c.email ?? "").toLowerCase().includes(value) ||
(c.nick ?? "").toLowerCase().includes(value)

if(monthFilter === "all") return match

const parts = (c.month || "").split(".")
if(parts.length < 2) return match

const month = parts[1].padStart(2,"0")

return match && month === monthFilter
})

/* ---------- PAGINATION ---------- */
const pages = Math.max(1, Math.ceil(filtered.length / perPage))
const visibleClients = filtered.slice((page-1)*perPage,page*perPage)

/* ---------- STATS ---------- */
const income = filtered.reduce((sum:number,c:any)=>{
return c.status==="продлено" ? sum + Number(c.price || 0) : sum
},0)

const paid = filtered.filter(c=>c.status==="продлено").length
const unpaid = filtered.filter(c=>c.status==="не оплачено").length

/* ---------- PROVIDER STATS (UI only) ---------- */
const providerStats:any = {}
filtered.forEach((c:any)=>{
if(c.provider){
providerStats[c.provider] = (providerStats[c.provider] || 0) + 1
}
})

return(

<div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">

{/* HEADER */}
<div className="flex justify-between mb-6">
<h1 className="text-xl md:text-3xl font-bold">📡 IDA TV: ADMIN</h1>
<button onClick={()=>{localStorage.removeItem("admin");router.push("/login")}} className="bg-red-600 px-3 py-1 rounded">
Выйти
</button>
</div>

{/* СТАТИСТИКА (МАЛЕНЬКАЯ) */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 text-xs">

<div className="bg-gray-800 p-2 rounded">
<p>Клиенты</p>
<p className="font-bold">{filtered.length}</p>
</div>

<div className="bg-green-600 p-2 rounded">
<p>Продлено</p>
<p className="font-bold">{paid}</p>
</div>

<div className="bg-red-600 p-2 rounded">
<p>Должники</p>
<p className="font-bold">{unpaid}</p>
</div>

<div className="bg-yellow-500 text-black p-2 rounded">
<p>Доход</p>
<p className="font-bold">{income} €</p>
</div>

</div>

{/* ПРОВАЙДЕРЫ */}
<div className="mb-4 text-xs flex flex-wrap gap-1">
{Object.entries(providerStats).map(([p,c])=>(
<span key={p} className={badge}>{p}:{String(c)}</span>
))}
</div>

{/* ПОИСК + МЕСЯЦ */}
<div className="flex gap-2 mb-6 flex-wrap">

<input
placeholder="Поиск..."
className="bg-gray-800 border border-gray-700 p-2 rounded"
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

<select
className="bg-gray-800 border border-gray-700 p-2 rounded"
value={monthFilter}
onChange={(e)=>setMonthFilter(e.target.value)}
>
<option value="all">Все</option>
<option value="01">01</option>
<option value="02">02</option>
<option value="03">03</option>
<option value="04">04</option>
<option value="05">05</option>
<option value="06">06</option>
<option value="07">07</option>
<option value="08">08</option>
<option value="09">09</option>
<option value="10">10</option>
<option value="11">11</option>
<option value="12">12</option>
</select>

</div>

{/* ФОРМА */}
<div className="bg-white text-black p-4 rounded mb-6">

<div className="grid md:grid-cols-3 gap-2">

<input placeholder="Имя" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}/>
<input placeholder="Телефон" value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})}/>
<input placeholder="Адрес" value={form.address} onChange={(e)=>setForm({...form,address:e.target.value})}/>
<input placeholder="Email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})}/>
<input placeholder="Nick" value={form.nick} onChange={(e)=>setForm({...form,nick:e.target.value})}/>

<select value={form.provider} onChange={(e)=>setForm({...form,provider:e.target.value})}>
<option value="">Провайдер</option>
<option>Edem.tv</option>
<option>Yosso.TV</option>
<option>New.tv.team</option>
<option>Antifriz.tv</option>
<option>Alltv.club</option>
<option>Uspeh.tv</option>
</select>

<select value={form.owner} onChange={(e)=>setForm({...form,owner:e.target.value})}>
<option value="">Кто</option>
<option>Ilja</option>
<option>Artjom</option>
<option>Общий</option>
</select>

<input placeholder="Arve" value={form.invoiceNr} onChange={(e)=>setForm({...form,invoiceNr:e.target.value})}/>
<input placeholder="Сумма" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})}/>
<input placeholder="Дата" value={form.month} onChange={(e)=>setForm({...form,month:e.target.value})}/>
<input placeholder="Продление" value={form.renewalDate} onChange={(e)=>setForm({...form,renewalDate:e.target.value})}/>

<select value={form.status} onChange={(e)=>setForm({...form,status:e.target.value})}>
<option value="не оплачено">не оплачено</option>
<option value="продлено">продлено</option>
</select>

<textarea value={form.comment} onChange={(e)=>setForm({...form,comment:e.target.value})}/>

<button onClick={addClient} className="bg-blue-600 text-white p-2 md:col-span-3">
{editingId ? "Сохранить":"Добавить"}
</button>

</div>

</div>

{/* ТАБЛИЦА */}
<div className="bg-gray-800 rounded overflow-x-auto">

<table className="w-full text-xs text-center">

<thead className="bg-gray-700">
<tr>
<th>Имя</th>
<th>Телефон</th>
<th>Сумма</th>
<th>Статус</th>
<th></th>
</tr>
</thead>

<tbody>

{visibleClients.map((c:any)=>(

<tr key={c.id} className="border-t border-gray-700">
<td>{c.name}</td>
<td>{c.phone}</td>
<td>{c.price}</td>
<td>{c.status}</td>
<td className="flex gap-1 justify-center">
<button onClick={()=>editClient(c)}><Pencil size={14}/></button>
<button onClick={()=>deleteClient(c.id)}><Trash size={14}/></button>
</td>
</tr>

))}

</tbody>

</table>

</div>

{/* ПАГИНАЦИЯ */}
<div className="flex justify-center gap-1 mt-4 text-xs">
{Array.from({length:pages}).map((_,i)=>{
const p=i+1
return(
<button key={p} onClick={()=>setPage(p)}
className={p===page ? "bg-blue-600 px-2 py-0.5 rounded" : "bg-gray-700 px-2 py-0.5 rounded"}>
{p}
</button>
)
})}
</div>

</div>

)

}
