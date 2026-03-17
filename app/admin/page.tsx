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

const badge = "border border-blue-500 text-white px-3 py-1 rounded-full whitespace-nowrap"

/* ---------- FIX PAGE ---------- */

useEffect(()=>{
setPage(1)
},[search,monthFilter])

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
console.log("API ERROR:", data)
setClients([])
}

}catch(e){

console.log("Ошибка:",e)
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
...form,
price:Number(form.price || 0)
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
provider:c.provider || "",
owner:c.owner || "",
invoiceNr:c.invoiceNr || "",
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

const pages = Math.ceil(filtered.length / perPage)
const visibleClients = filtered.slice((page-1)*perPage,page*perPage)

/* ---------- STATS ---------- */

const income = filtered.reduce((sum:number,c:any)=>{
return c.status==="продлено" ? sum + Number(c.price || 0) : sum
},0)

const paid = filtered.filter(c=>c.status==="продлено").length
const unpaid = filtered.filter(c=>c.status==="не оплачено").length

const providerStats:any = {}
const ownerStats:any = {}

filtered.forEach((c:any)=>{
if(c.provider){
providerStats[c.provider] = (providerStats[c.provider] || 0) + 1
}
if(c.owner){
ownerStats[c.owner] = (ownerStats[c.owner] || 0) + 1
}
})

return(

<div className="p-4 md:p-10 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">

{/* HEADER */}

<div className="flex justify-between mb-10">

<h1 className="text-2xl md:text-4xl font-bold">📡 IDA TV: ADMIN</h1>

<button
onClick={()=>{
localStorage.removeItem("admin")
router.push("/login")
}}
className="bg-red-600 px-4 py-2 rounded-lg"
>
Выйти
</button>

</div>

{/* СТАТИСТИКА (уменьшена) */}

<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 text-sm">

<div className="bg-gray-800 p-3 rounded">
<p>Клиенты</p>
<p className="text-lg font-bold">{filtered.length}</p>
</div>

<div className="bg-green-600 p-3 rounded">
<p>Продлено</p>
<p className="text-lg font-bold">{paid}</p>
</div>

<div className="bg-red-600 p-3 rounded">
<p>Должники</p>
<p className="text-lg font-bold">{unpaid}</p>
</div>

<div className="bg-yellow-500 text-black p-3 rounded">
<p>Доход</p>
<p className="text-lg font-bold">{income} €</p>
</div>

</div>

{/* ДОП СТАТИСТИКА */}

<div className="mb-6 text-sm">

<div className="mb-2">Провайдеры:</div>
<div className="flex flex-wrap gap-2">
{Object.entries(providerStats).map(([p,c])=>(
<span key={p} className={badge}>{p}: {String(c)}</span>
))}
</div>

<div className="mt-3 mb-2">У кого клиент:</div>
<div className="flex flex-wrap gap-2">
{Object.entries(ownerStats).map(([o,c])=>(
<span key={o} className={badge}>{o}: {String(c)}</span>
))}
</div>

</div>

{/* ПОИСК */}

<div className="flex gap-4 mb-10">

<input
placeholder="Поиск клиента..."
className="bg-gray-800 border border-gray-700 p-3 rounded-lg w-72"
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

</div>

{/* ФОРМА */}

<div className="bg-white text-black p-6 md:p-8 rounded-xl shadow-xl mb-12">

<h2 className="text-xl font-semibold mb-6 text-purple-600">
➕ Добавить клиента
</h2>

<div className="grid grid-cols-1 md:grid-cols-3 gap-4">

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
<option value="">У кого клиент</option>
<option>Ilja</option>
<option>Artjom</option>
<option>Общий</option>
</select>

<input placeholder="Arve nr" value={form.invoiceNr} onChange={(e)=>setForm({...form,invoiceNr:e.target.value})}/>

<input placeholder="Сумма" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})}/>
<input placeholder="Дата подключения" value={form.month} onChange={(e)=>setForm({...form,month:e.target.value})}/>
<input placeholder="Дата продления" value={form.renewalDate} onChange={(e)=>setForm({...form,renewalDate:e.target.value})}/>

<select value={form.status} onChange={(e)=>setForm({...form,status:e.target.value})}>
<option value="не оплачено">не оплачено</option>
<option value="продлено">продлено</option>
</select>

<textarea value={form.comment} onChange={(e)=>setForm({...form,comment:e.target.value})} className="md:col-span-3"/>

<button onClick={addClient} className="bg-blue-600 text-white p-3 md:col-span-3">
{editingId ? "Сохранить":"Добавить клиента"}
</button>

</div>

</div>

{/* ТАБЛИЦА */}

<div className="bg-gray-800 rounded-xl overflow-x-auto">

<table className="w-full text-center">

<thead className="bg-gray-700">
<tr>
<th>Имя</th>
<th>Телефон</th>
<th>Провайдер</th>
<th>Arve</th>
<th>Ответственный</th>
<th>Сумма</th>
<th>Статус</th>
<th>Действия</th>
</tr>
</thead>

<tbody>

{visibleClients.map((c:any)=>(

<tr key={c.id} className="border-t border-gray-700">

<td>{c.name}</td>
<td>{c.phone}</td>
<td>{c.provider || "-"}</td>
<td>{c.invoiceNr || "-"}</td>
<td>{c.owner || "-"}</td>
<td>{c.price} €</td>

<td>
<span className={c.status==="продлено"
? "bg-green-600 px-2 rounded"
: "bg-red-600 px-2 rounded"}>
{c.status}
</span>
</td>

<td className="flex gap-2 justify-center">
<button onClick={()=>editClient(c)}><Pencil size={16}/></button>
<button onClick={()=>deleteClient(c.id)}><Trash size={16}/></button>
</td>

</tr>

))}

</tbody>

</table>

</div>

{/* ПАГИНАЦИЯ */}

<div className="flex justify-center gap-2 mt-6">

{Array.from({length:pages}).map((_,i)=>{
const p=i+1
return(
<button key={p} onClick={()=>setPage(p)}
className={p===page ? "bg-blue-600 px-3 py-1 rounded" : "bg-gray-700 px-3 py-1 rounded"}>
{p}
</button>
)
})}

</div>

</div>

)

}
