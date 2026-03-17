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

/* ---------- FIX PAGINATION ---------- */

useEffect(()=>{
setPage(1)
},[search,monthFilter])

/* ---------- ПРОВЕРКА ВХОДА ---------- */

useEffect(()=>{
const admin = localStorage.getItem("admin")
if(!admin){
router.push("/login")
return
}
loadClients()
},[])

/* ---------- ЗАГРУЗКА (FIXED) ---------- */

async function loadClients(){

try{

const res = await fetch("/api/clients",{cache:"no-store"})

if(!res.ok){
console.log("API ERROR")
setClients([])
return
}

const data = await res.json()

if(Array.isArray(data)){
setClients(data)
}else{
console.log("NOT ARRAY:", data)
setClients([])
}

}catch(e){
console.log("LOAD ERROR:", e)
setClients([])
}

}

/* ---------- СОХРАНЕНИЕ ---------- */

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

/* ---------- РЕДАКТИРОВАНИЕ ---------- */

function editClient(c:any){

setForm({
name:c?.name || "",
phone:c?.phone || "",
address:c?.address || "",
email:c?.email || "",
nick:c?.nick || "",
provider:c?.provider || "",
owner:c?.owner || "",
invoiceNr:c?.invoiceNr || "",
price:String(c?.price || ""),
month:c?.month || "",
renewalDate:c?.renewalDate || "",
status:c?.status || "не оплачено",
comment:c?.comment || ""
})

setEditingId(c.id)

}

/* ---------- УДАЛЕНИЕ ---------- */

async function deleteClient(id:number){

if(!confirm("Удалить клиента?")) return

await fetch("/api/clients",{
method:"DELETE",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({id})
})

loadClients()

}

/* ---------- ФИЛЬТР (SAFE) ---------- */

const filtered = (clients || []).filter((c:any)=>{

const value = search.toLowerCase()

const match =
(c?.name ?? "").toLowerCase().includes(value) ||
(c?.phone ?? "").toLowerCase().includes(value) ||
(c?.address ?? "").toLowerCase().includes(value) ||
(c?.email ?? "").toLowerCase().includes(value) ||
(c?.nick ?? "").toLowerCase().includes(value)

if(monthFilter === "all") return match

const parts = (c?.month || "").split(".")
if(parts.length < 2) return match

const month = parts[1].padStart(2,"0")

return match && month === monthFilter

})

/* ---------- ПАГИНАЦИЯ ---------- */

const pages = Math.ceil(filtered.length / perPage)
const visibleClients = filtered.slice((page-1)*perPage,page*perPage)

/* ---------- СТАТИСТИКА ---------- */

const income = filtered.reduce((sum:number,c:any)=>{
return c?.status==="продлено" ? sum + Number(c?.price || 0) : sum
},0)

const paid = filtered.filter(c=>c?.status==="продлено").length
const unpaid = filtered.filter(c=>c?.status==="не оплачено").length

const providerStats:any = {}
const ownerStats:any = {}

filtered.forEach((c:any)=>{
if(c?.provider){
providerStats[c.provider] = (providerStats[c.provider] || 0) + 1
}
if(c?.owner){
ownerStats[c.owner] = (ownerStats[c.owner] || 0) + 1
}
})

return(

<div className="p-4 md:p-10 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">

<div className="flex justify-between mb-10">

<h1 className="text-2xl font-bold">📡 IDA TV: ADMIN</h1>

<button
onClick={()=>{localStorage.removeItem("admin");router.push("/login")}}
className="bg-red-600 px-4 py-2 rounded"
>
Выйти
</button>

</div>

{/* СТАТИСТИКА */}

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
<div className="flex flex-wrap gap-2 mb-4">
{Object.entries(providerStats).map(([p,c])=>(
<span key={p} className={badge}>{p}: {String(c)}</span>
))}
</div>

<div className="mb-2">У кого клиент:</div>
<div className="flex flex-wrap gap-2">
{Object.entries(ownerStats).map(([o,c])=>(
<span key={o} className={badge}>{o}: {String(c)}</span>
))}
</div>

</div>

{/* ФОРМА */}

<div className="bg-white text-black p-6 rounded-xl mb-12">

<div className="grid md:grid-cols-3 gap-4">

<input placeholder="Имя" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}/>
<input placeholder="Телефон" value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})}/>
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

<button onClick={addClient} className="bg-blue-600 text-white p-2 col-span-3">
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
<th>Действия</th>
</tr>
</thead>

<tbody>

{visibleClients?.map((c:any)=>(

<tr key={c.id} className="border-t border-gray-700">

<td><span className={badge}>{c?.name}</span></td>
<td><span className={badge}>{c?.phone}</span></td>
<td><span className={badge}>{c?.provider || "-"}</span></td>
<td><span className={badge}>{c?.invoiceNr || "-"}</span></td>
<td><span className={badge}>{c?.owner || "-"}</span></td>

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
