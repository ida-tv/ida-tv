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
invoice:"",
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
provider:"",
owner:"",
invoice:"",
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
provider:c.provider || "",
owner:c.owner || "",
invoice:c.invoice || "",
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

if(monthFilter === "all") return match

const parts = (c.month || "").split(".")

if(parts.length < 2) return match

const month = parts[1].padStart(2,"0")

return match && month === monthFilter

})

/* ---------- ПАГИНАЦИЯ ---------- */

const pages = Math.ceil(filtered.length / perPage)

const start = (page-1) * perPage
const end = start + perPage

const visibleClients = filtered.slice(start,end)

/* ---------- СТАТИСТИКА ---------- */

const income = filtered.reduce((sum:number,c:any)=>{

if(c.status==="продлено"){
return sum + Number(c.price || 0)
}

return sum

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

<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-10">

<h1 className="text-2xl md:text-4xl font-bold">
📡 IDA TV: ADMIN
</h1>

<button
onClick={()=>{
localStorage.removeItem("admin")
router.push("/login")
}}
className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
>
Выйти
</button>

</div>

{/* СТАТИСТИКА */}

<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 text-sm">

<div className="bg-gray-800 p-3 rounded-lg">
<p className="text-gray-400">Клиенты</p>
<p className="text-xl font-bold">{filtered.length}</p>
</div>

<div className="bg-green-600 p-3 rounded-lg">
<p>Продлено</p>
<p className="text-xl font-bold">{paid}</p>
</div>

<div className="bg-red-600 p-3 rounded-lg">
<p>Должники</p>
<p className="text-xl font-bold">{unpaid}</p>
</div>

<div className="bg-yellow-500 text-black p-3 rounded-lg">
<p>Доход</p>
<p className="text-xl font-bold">{income} €</p>
</div>

</div>

{/* СТАТИСТИКА ПРОВАЙДЕРОВ */}

<div className="mb-4 text-sm">

<p className="text-gray-300 mb-2">Провайдеры</p>

<div className="flex flex-wrap gap-2">

{Object.entries(providerStats).map(([p,count])=>(
<span key={p} className="border border-blue-500 px-3 py-1 rounded-full">
{p}: {String(count)}
</span>
))}

</div>

</div>

{/* СТАТИСТИКА МЕНЕДЖЕРОВ */}

<div className="mb-8 text-sm">

<p className="text-gray-300 mb-2">У кого клиент</p>

<div className="flex flex-wrap gap-2">

{Object.entries(ownerStats).map(([o,count])=>(
<span key={o} className="border border-blue-500 px-3 py-1 rounded-full">
{o}: {String(count)}
</span>
))}

</div>

</div>

{/* ПОИСК */}

<div className="flex flex-col md:flex-row gap-4 mb-10">

<input
placeholder="Поиск клиента..."
className="bg-gray-800 border border-gray-700 p-3 rounded-lg w-full md:w-72"
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

<select
className="bg-gray-800 border border-gray-700 p-3 rounded-lg"
value={monthFilter}
onChange={(e)=>setMonthFilter(e.target.value)}
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

</div>

{/* ФОРМА */}

<div className="bg-white text-black p-6 md:p-8 rounded-xl shadow-xl mb-12">

<h2 className="text-xl font-semibold mb-6 text-purple-600">
➕ Добавить клиента
</h2>

<div className="grid grid-cols-1 md:grid-cols-3 gap-4">

<input placeholder="Имя"
value={form.name}
onChange={(e)=>setForm({...form,name:e.target.value})}
className="border p-2 rounded"/>

<input placeholder="Телефон"
value={form.phone}
onChange={(e)=>setForm({...form,phone:e.target.value})}
className="border p-2 rounded"/>

<input placeholder="Адрес"
value={form.address}
onChange={(e)=>setForm({...form,address:e.target.value})}
className="border p-2 rounded"/>

<input placeholder="Email"
value={form.email}
onChange={(e)=>setForm({...form,email:e.target.value})}
className="border p-2 rounded"/>

<input placeholder="Nick"
value={form.nick}
onChange={(e)=>setForm({...form,nick:e.target.value})}
className="border p-2 rounded"/>

<select
value={form.provider}
onChange={(e)=>setForm({...form,provider:e.target.value})}
className="border p-2 rounded">

<option value="">Провайдер</option>
<option>Edem.tv</option>
<option>Yosso.TV</option>
<option>New.tv.team</option>
<option>Antifriz.tv</option>
<option>Alltv.club</option>
<option>Uspeh.tv</option>

</select>

<select
value={form.owner}
onChange={(e)=>setForm({...form,owner:e.target.value})}
className="border p-2 rounded">

<option value="">У кого клиент</option>
<option>Ilja</option>
<option>Artjom</option>
<option>Общий</option>

</select>

<input
placeholder="Arve nr"
value={form.invoice}
onChange={(e)=>setForm({...form,invoice:e.target.value})}
className="border p-2 rounded"
/>

<input placeholder="Сумма"
value={form.price}
onChange={(e)=>setForm({...form,price:e.target.value})}
className="border p-2 rounded"/>

<input placeholder="Дата подключения"
value={form.month}
onChange={(e)=>setForm({...form,month:e.target.value})}
className="border p-2 rounded"/>

<input placeholder="Дата продления"
value={form.renewalDate}
onChange={(e)=>setForm({...form,renewalDate:e.target.value})}
className="border p-2 rounded"/>

<select
value={form.status}
onChange={(e)=>setForm({...form,status:e.target.value})}
className="border p-2 rounded">

<option value="не оплачено">не оплачено</option>
<option value="продлено">продлено</option>

</select>

<textarea
placeholder="Комментарий"
value={form.comment}
onChange={(e)=>setForm({...form,comment:e.target.value})}
className="border p-2 rounded md:col-span-3"
/>

<button
onClick={addClient}
className="bg-blue-600 text-white p-3 rounded-lg md:col-span-3 hover:bg-blue-700 transition"
>

{editingId ? "Сохранить":"Добавить клиента"}

</button>

</div>

</div>

{/* ТАБЛИЦА */}

<div className="bg-gray-800 rounded-xl overflow-x-auto shadow">

<table className="w-full text-center">

<thead className="bg-gray-700">

<tr>

<th className="p-2">Имя</th>
<th className="p-2">Телефон</th>
<th className="p-2">Адрес</th>
<th className="p-2">Email</th>
<th className="p-2">Nick</th>
<th className="p-2">Провайдер</th>
<th className="p-2">Arve</th>
<th className="p-2">Ответственный</th>
<th className="p-2">Сумма</th>
<th className="p-2">Дата подключения</th>
<th className="p-2">Дата продления</th>
<th className="p-2">Статус</th>
<th className="p-2">Комментарий</th>
<th className="p-2">Действия</th>

</tr>

</thead>

<tbody>

{visibleClients.map((c:any)=>(

<tr
key={c.id}
className="border-t border-gray-700 bg-blue-900/30 hover:bg-blue-800/40 transition"
>

<td className="p-2"><span className={badge}>{c.name}</span></td>
<td className="p-2"><span className={badge}>{c.phone}</span></td>
<td className="p-2"><span className={badge}>{c.address}</span></td>
<td className="p-2"><span className={badge}>{c.email || "-"}</span></td>
<td className="p-2"><span className={badge}>{c.nick || "-"}</span></td>
<td className="p-2"><span className={badge}>{c.provider || "-"}</span></td>
<td className="p-2"><span className={badge}>{c.invoice || "-"}</span></td>
<td className="p-2"><span className={badge}>{c.owner || "-"}</span></td>
<td className="p-2"><span className={badge}>{c.price} €</span></td>
<td className="p-2"><span className={badge}>{c.month}</span></td>
<td className="p-2"><span className={badge}>{c.renewalDate}</span></td>

<td className="p-2">
<span className={
c.status==="продлено"
? "border border-blue-500 text-white px-3 py-1 rounded-full bg-green-600"
: "border border-blue-500 text-white px-3 py-1 rounded-full bg-red-600"
}>
{c.status}
</span>
</td>

<td className="p-2">

{c.comment ? (

<button
onClick={()=>alert(c.comment)}
className="border border-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-800"
>
<MessageCircle size={16}/>
</button>

) : (
<span className={badge}>-</span>
)}

</td>

<td className="flex justify-center gap-2 p-2">

<button
onClick={()=>editClient(c)}
className="border border-blue-500 text-white px-3 py-1 rounded hover:bg-blue-800"
>
<Pencil size={16}/>
</button>

<button
onClick={()=>deleteClient(c.id)}
className="border border-blue-500 text-white px-3 py-1 rounded hover:bg-red-700"
>
<Trash size={16}/>
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

{/* ПАГИНАЦИЯ */}

<div className="flex justify-center gap-2 mt-6">

{Array.from({length:pages}).map((_,i)=>{

const p = i+1

return(

<button
key={p}
onClick={()=>setPage(p)}
className={
p===page
? "px-3 py-1 bg-blue-600 rounded"
: "px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
}
>

{p}

</button>

)

})}

</div>

</div>

)

}
