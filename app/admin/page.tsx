"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Trash, Pencil, MessageCircle } from "lucide-react"

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

const badge = "border border-blue-500 text-white px-3 py-1 rounded-full whitespace-nowrap"

/* ---------- ПРОВЕРКА ВХОДА ---------- */

useEffect(()=>{

const admin = localStorage.getItem("admin")

if(!admin){
router.push("/login")
return
}

loadClients()

},[])

/* ---------- ЗАГРУЗКА ---------- */

async function loadClients(){

try{

const res = await fetch("/api/clients",{cache:"no-store"})

if(!res.ok) throw new Error("Ошибка загрузки")

const data = await res.json()

setClients(data)

}catch(e){

console.log("Ошибка:",e)

}

}

/* ---------- СОХРАНЕНИЕ ---------- */

async function addClient(){

if(!form.name || !form.phone){
alert("Введите имя и телефон")
return
}

try{

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

}catch(e){

alert("Ошибка сохранения")

}

}

/* ---------- РЕДАКТИРОВАНИЕ ---------- */

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

/* ---------- УДАЛЕНИЕ ---------- */

async function deleteClient(id:number){

if(!confirm("Удалить клиента?")) return

try{

await fetch("/api/clients",{
method:"DELETE",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({id})
})

loadClients()

}catch(e){

alert("Ошибка удаления")

}

}

/* ---------- ФИЛЬТР ---------- */

const filtered = clients.filter((c:any)=>{

const value = search.toLowerCase()

const match =
(c.name ?? "").toLowerCase().includes(value) ||
(c.phone ?? "").toLowerCase().includes(value) ||
(c.address ?? "").toLowerCase().includes(value) ||
(c.email ?? "").toLowerCase().includes(value) ||
(c.nick ?? "").toLowerCase().includes(value)

if(!match) return false

if(providerFilter !== "all" && c.provider !== providerFilter){
return false
}

if(monthFilter === "all") return true

const parts = (c.month || "").split(".")

if(parts.length < 2) return true

const month = parts[1].padStart(2,"0")

return month === monthFilter

})

/* ---------- PAGINATION ---------- */

const totalPages = Math.ceil(filtered.length / perPage)
const start = (page - 1) * perPage
const end = start + perPage
const paginatedClients = filtered.slice(start,end)

/* ---------- СТАТИСТИКА ---------- */

const income = filtered.reduce((sum:number,c:any)=>{
if(c.status==="продлено"){
return sum + Number(c.price || 0)
}
return sum
},0)

const paid = filtered.filter(c=>c.status==="продлено").length
const unpaid = filtered.filter(c=>c.status==="не оплачено").length

/* ---------- СТАТИСТИКА ПО ЛЮДЯМ ---------- */

const iljaClients = clients.filter(c=>c.owner==="Ilja").length
const artjomClients = clients.filter(c=>c.owner==="Artjom").length
const commonClients = clients.filter(c=>c.owner==="Общий").length

/* ---------- СТАТИСТИКА ПРОВАЙДЕРОВ ---------- */

const edem = clients.filter(c=>c.provider==="Edem.TV").length
const yosso = clients.filter(c=>c.provider==="Yosso.TV").length
const alltv = clients.filter(c=>c.provider==="alltv.club").length
const newtv = clients.filter(c=>c.provider==="new.tv.team").length
const uspeh = clients.filter(c=>c.provider==="uspeh.tv").length

return(

<div className="p-4 md:p-10 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">

{/* HEADER */}

<div className="flex justify-between mb-10">

<h1 className="text-3xl font-bold">📡 IDA TV: ADMIN</h1>

<button
onClick={()=>{
localStorage.removeItem("admin")
router.push("/login")
}}
className="bg-red-600 px-4 py-2 rounded-lg"

>

Выйти </button>

</div>

{/* СТАТИСТИКА */}

<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

<div className="bg-gray-800 p-5 rounded-xl">
<p>Клиентов</p>
<p className="text-3xl font-bold">{filtered.length}</p>
</div>

<div className="bg-green-600 p-5 rounded-xl">
<p>Продлено</p>
<p className="text-3xl font-bold">{paid}</p>
</div>

<div className="bg-red-600 p-5 rounded-xl">
<p>Должники</p>
<p className="text-3xl font-bold">{unpaid}</p>
</div>

<div className="bg-yellow-500 p-5 rounded-xl text-black">
<p>Доход</p>
<p className="text-3xl font-bold">{income} €</p>
</div>

</div>

{/* СТАТИСТИКА ПО ЛЮДЯМ */}

<div className="grid grid-cols-3 gap-4 mb-6">

<div className="bg-blue-600 p-4 rounded-xl text-center">
<p>Ilja</p>
<p className="text-2xl font-bold">{iljaClients}</p>
</div>

<div className="bg-purple-600 p-4 rounded-xl text-center">
<p>Artjom</p>
<p className="text-2xl font-bold">{artjomClients}</p>
</div>

<div className="bg-gray-600 p-4 rounded-xl text-center">
<p>Общий</p>
<p className="text-2xl font-bold">{commonClients}</p>
</div>

</div>

{/* СТАТИСТИКА ПРОВАЙДЕРОВ */}

<div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">

<div className="bg-purple-600 p-4 rounded-xl text-center">
<p>Edem.TV</p>
<p className="text-2xl font-bold">{edem}</p>
</div>

<div className="bg-indigo-600 p-4 rounded-xl text-center">
<p>Yosso.TV</p>
<p className="text-2xl font-bold">{yosso}</p>
</div>

<div className="bg-blue-600 p-4 rounded-xl text-center">
<p>alltv.club</p>
<p className="text-2xl font-bold">{alltv}</p>
</div>

<div className="bg-green-600 p-4 rounded-xl text-center">
<p>new.tv.team</p>
<p className="text-2xl font-bold">{newtv}</p>
</div>

<div className="bg-yellow-600 p-4 rounded-xl text-center">
<p>uspeh.tv</p>
<p className="text-2xl font-bold">{uspeh}</p>
</div>

</div>

{/* ПОИСК */}

<input
placeholder="Поиск клиента..."
className="bg-gray-800 p-3 rounded-lg mb-6 w-full md:w-72"
value={search}
onChange={(e)=>{
setSearch(e.target.value)
setPage(1)
}}
/>

{/* ФОРМА */}

<div className="bg-white text-black p-6 rounded-xl mb-12">

<h2 className="text-xl mb-6">➕ Добавить клиента</h2>

<div className="grid md:grid-cols-3 gap-4">

<input placeholder="Имя" value={form.name}
onChange={(e)=>setForm({...form,name:e.target.value})}
className="border p-2 rounded"/>

<input placeholder="Телефон" value={form.phone}
onChange={(e)=>setForm({...form,phone:e.target.value})}
className="border p-2 rounded"/>

<input placeholder="Адрес" value={form.address}
onChange={(e)=>setForm({...form,address:e.target.value})}
className="border p-2 rounded"/>

<input placeholder="Email" value={form.email}
onChange={(e)=>setForm({...form,email:e.target.value})}
className="border p-2 rounded"/>

<input placeholder="Nick" value={form.nick}
onChange={(e)=>setForm({...form,nick:e.target.value})}
className="border p-2 rounded"/>

<input placeholder="Arve nr" value={form.arveNr}
onChange={(e)=>setForm({...form,arveNr:e.target.value})}
className="border p-2 rounded"/>

<select value={form.owner}
onChange={(e)=>setForm({...form,owner:e.target.value})}
className="border p-2 rounded">

<option value="Ilja">Ilja</option>
<option value="Artjom">Artjom</option>
<option value="Общий">Общий</option>

</select>

<select value={form.provider}
onChange={(e)=>setForm({...form,provider:e.target.value})}
className="border p-2 rounded">

<option>Edem.TV</option>
<option>Yosso.TV</option>
<option>alltv.club</option>
<option>new.tv.team</option>
<option>uspeh.tv</option>

</select>

<input placeholder="Сумма" value={form.price}
onChange={(e)=>setForm({...form,price:e.target.value})}
className="border p-2 rounded"/>

<input placeholder="Дата подключения" value={form.month}
onChange={(e)=>setForm({...form,month:e.target.value})}
className="border p-2 rounded"/>

<input placeholder="Дата продления" value={form.renewalDate}
onChange={(e)=>setForm({...form,renewalDate:e.target.value})}
className="border p-2 rounded"/>

<select value={form.status}
onChange={(e)=>setForm({...form,status:e.target.value})}
className="border p-2 rounded">

<option value="не оплачено">не оплачено</option>
<option value="продлено">продлено</option>

</select>

<textarea placeholder="Комментарий"
value={form.comment}
onChange={(e)=>setForm({...form,comment:e.target.value})}
className="border p-2 rounded md:col-span-3"
/>

<button onClick={addClient}
className="bg-blue-600 text-white p-3 rounded-lg md:col-span-3">
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
<th>Адрес</th>
<th>Email</th>
<th>Nick</th>
<th>Arve</th>
<th>У кого</th>
<th>Провайдер</th>
<th>€</th>
<th>Продление</th>
<th>Статус</th>
<th>Комментарий</th>
<th>Действия</th>

</tr>

</thead>

<tbody>

{paginatedClients.map((c:any)=>(

<tr key={c.id} className="border-t border-gray-700">

<td>{c.name}</td>
<td>{c.phone}</td>
<td>{c.address}</td>
<td>{c.email}</td>
<td>{c.nick}</td>
<td>{c.arveNr}</td>
<td>{c.owner}</td>
<td>{c.provider}</td>
<td>{c.price}</td>
<td>{c.renewalDate}</td>

<td>
<span className={
c.status==="продлено"
? "bg-green-600 px-2 py-1 rounded"
: "bg-red-600 px-2 py-1 rounded"
}>
{c.status}
</span>
</td>

<td>

{c.comment ? (
<button onClick={()=>alert(c.comment)}>
<MessageCircle size={16}/>
</button>
) : "-"}

</td>

<td className="flex justify-center gap-2">

<button onClick={()=>editClient(c)}>
<Pencil size={16}/>
</button>

<button onClick={()=>deleteClient(c.id)}>
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
