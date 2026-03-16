"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Trash, Pencil } from "lucide-react"

export default function Admin(){

const router = useRouter()

const [clients,setClients] = useState<any[]>([])
const [search,setSearch] = useState("")
const [monthFilter,setMonthFilter] = useState("all")
const [providerFilter,setProviderFilter] = useState("all")

const [editingId,setEditingId] = useState<number | null>(null)

const [page,setPage] = useState(1)
const perPage = 20

const [form,setForm] = useState({
name:"",
phone:"",
address:"",
email:"",
nick:"",
arveNr:"",
owner:"Общий",
provider:"Edem.TV",
price:"",
month:"",
renewalDate:"",
status:"не оплачено",
comment:""
})

useEffect(()=>{

const admin = localStorage.getItem("admin")

if(!admin){
router.push("/login")
return
}

loadClients()

},[])

/* LOAD */

async function loadClients(){

const res = await fetch("/api/clients",{cache:"no-store"})
const data = await res.json()
setClients(data)

}

/* SAVE */

async function addClient(){

if(!form.name || !form.phone){
alert("Введите имя и телефон")
return
}

const method = editingId ? "PUT" : "POST"

await fetch("/api/clients",{

method,

headers:{
"Content-Type":"application/json"
},

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
arveNr:"",
owner:"Общий",
provider:"Edem.TV",
price:"",
month:"",
renewalDate:"",
status:"не оплачено",
comment:""
})

setEditingId(null)

loadClients()

}

/* EDIT */

function editClient(c:any){

setForm({
name:c.name || "",
phone:c.phone || "",
address:c.address || "",
email:c.email || "",
nick:c.nick || "",
arveNr:c.arveNr || "",
owner:c.owner || "Общий",
provider:c.provider || "Edem.TV",
price:String(c.price || ""),
month:c.month || "",
renewalDate:c.renewalDate || "",
status:c.status || "не оплачено",
comment:c.comment || ""
})

setEditingId(c.id)

}

/* DELETE */

async function deleteClient(id:number){

if(!confirm("Удалить клиента?")) return

await fetch("/api/clients",{
method:"DELETE",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({id})
})

loadClients()

}

/* FILTER */

const filtered = clients.filter((c:any)=>{

const value = search.toLowerCase()

const matchSearch =
(c.name ?? "").toLowerCase().includes(value) ||
(c.phone ?? "").toLowerCase().includes(value) ||
(c.address ?? "").toLowerCase().includes(value) ||
(c.email ?? "").toLowerCase().includes(value) ||
(c.nick ?? "").toLowerCase().includes(value)

if(!matchSearch) return false

if(providerFilter !== "all" && c.provider !== providerFilter){
return false
}

if(monthFilter === "all") return true

const parts = (c.month || "").split(".")

if(parts.length < 2) return true

const month = parts[1].padStart(2,"0")

return month === monthFilter

})

/* PAGINATION */

const totalPages = Math.ceil(filtered.length / perPage)
const start = (page - 1) * perPage
const paginatedClients = filtered.slice(start,start + perPage)

/* STATS */

const income = clients.reduce((sum:number,c:any)=>{
if(c.status==="продлено"){
return sum + Number(c.price || 0)
}
return sum
},0)

const paid = clients.filter(c=>c.status==="продлено").length
const unpaid = clients.filter(c=>c.status==="не оплачено").length

return(

<div className="p-6 md:p-10 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">

<h1 className="text-3xl font-bold mb-8">📡 IDA TV ADMIN</h1>

{/* FILTERS */}

<div className="flex flex-wrap gap-4 mb-6">

<input
placeholder="🔎 Поиск клиента..."
className="bg-gray-800 border border-gray-700 p-3 rounded-xl"
value={search}
onChange={(e)=>{
setSearch(e.target.value)
setPage(1)
}}
/>

<select
value={monthFilter}
onChange={(e)=>{
setMonthFilter(e.target.value)
setPage(1)
}}
className="bg-gray-800 border border-gray-700 p-3 rounded-xl"

>

<option value="all">Все месяцы</option>
<option value="01">Январь</option>
<option value="02">Февраль</option>
<option value="03">Март</option>
<option value="04">Апрель</option>
<option value="05">Май</option>
<option value="06">Июнь</option>
<option value="07">Июль</option>
<option value="08">Август</option>
<option value="09">Сентябрь</option>
<option value="10">Октябрь</option>
<option value="11">Ноябрь</option>
<option value="12">Декабрь</option>

</select>

<select
value={providerFilter}
onChange={(e)=>{
setProviderFilter(e.target.value)
setPage(1)
}}
className="bg-gray-800 border border-gray-700 p-3 rounded-xl"

>

<option value="all">Все провайдеры</option>
<option value="Edem.TV">Edem.TV</option>
<option value="Yosso.TV">Yosso.TV</option>
<option value="alltv.club">alltv.club</option>
<option value="new.tv.team">new.tv.team</option>
<option value="uspeh.tv">uspeh.tv</option>

</select>

</div>

{/* STATS */}

<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

<div className="bg-gray-800 p-4 rounded-xl">
<p>Клиентов</p>
<p className="text-2xl font-bold">{clients.length}</p>
</div>

<div className="bg-green-600 p-4 rounded-xl">
<p>Продлено</p>
<p className="text-2xl font-bold">{paid}</p>
</div>

<div className="bg-red-600 p-4 rounded-xl">
<p>Должники</p>
<p className="text-2xl font-bold">{unpaid}</p>
</div>

<div className="bg-yellow-500 p-4 rounded-xl text-black">
<p>Доход</p>
<p className="text-2xl font-bold">{income} €</p>
</div>

</div>

{/* TABLE */}

<div className="bg-gray-800 rounded-xl overflow-x-auto">

<table className="w-full text-center border border-gray-700">

<thead className="bg-gray-700">

<tr>

<th className="border p-2">Имя</th>
<th className="border p-2">Телефон</th>
<th className="border p-2">Адрес</th>
<th className="border p-2">Email</th>
<th className="border p-2">Nick</th>
<th className="border p-2">Arve</th>
<th className="border p-2">У кого</th>
<th className="border p-2">Провайдер</th>
<th className="border p-2">€</th>
<th className="border p-2">Продление</th>
<th className="border p-2">Статус</th>
<th className="border p-2">Действия</th>

</tr>

</thead>

<tbody>

{paginatedClients.map((c:any)=>(

<tr key={c.id} className="hover:bg-blue-900/30 transition">

<td className="border p-2">{c.name}</td>
<td className="border p-2">{c.phone}</td>
<td className="border p-2">{c.address}</td>
<td className="border p-2">{c.email}</td>
<td className="border p-2">{c.nick}</td>
<td className="border p-2">{c.arveNr}</td>
<td className="border p-2">{c.owner}</td>
<td className="border p-2">{c.provider}</td>
<td className="border p-2">{c.price}</td>
<td className="border p-2">{c.renewalDate}</td>

<td className="border p-2">

<span className={
c.status==="продлено"
? "bg-green-600 px-2 py-1 rounded"
: "bg-red-600 px-2 py-1 rounded"
}>

{c.status}

</span>

</td>

<td className="border p-2 flex justify-center gap-2">

<button
onClick={()=>editClient(c)}
className="bg-blue-600 p-2 rounded hover:bg-blue-700"

>

<Pencil size={16}/>

</button>

<button
onClick={()=>deleteClient(c.id)}
className="bg-red-600 p-2 rounded hover:bg-red-700"

>

<Trash size={16}/>

</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

{/* PAGINATION */}

<div className="flex justify-center gap-2 mt-6">

{Array.from({length:totalPages},(_,i)=>i+1).map(p=>(

<button
key={p}
onClick={()=>setPage(p)}
className={
p===page
? "bg-blue-600 px-4 py-2 rounded"
: "bg-gray-700 px-4 py-2 rounded"
}

>

{p}

</button>

))}

</div>

</div>

)

}
