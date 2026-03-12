"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Trash, Pencil } from "lucide-react"

export default function Admin(){

const router = useRouter()

const [clients,setClients] = useState<any[]>([])
const [search,setSearch] = useState("")
const [editingId,setEditingId] = useState<number | null>(null)
const [monthFilter,setMonthFilter] = useState("all")

const [form,setForm] = useState({
name:"",
phone:"",
address:"",
email:"",
nick:"",
price:"",
month:"",
status:"не оплачено",
renewalDate:"",
renewalStatus:"не продлено",
comment:""
})


/* ---------- ПРОВЕРКА ВХОДА ---------- */

useEffect(()=>{

const admin = localStorage.getItem("admin")

if(!admin){
router.push("/login")
return
}

loadClients()

},[])



/* ---------- ЗАГРУЗКА КЛИЕНТОВ ---------- */

async function loadClients(){

try{

const res = await fetch("/api/clients",{ cache:"no-store" })

if(!res.ok) throw new Error()

const data = await res.json()

setClients(data)

}catch(err){

console.log("Ошибка загрузки",err)

}

}



/* ---------- СОХРАНЕНИЕ КЛИЕНТА ---------- */

async function addClient(){

if(!form.name || !form.phone){
alert("Введите имя и телефон")
return
}

try{

const method = editingId ? "PUT" : "POST"

const res = await fetch("/api/clients",{
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

if(!res.ok){
console.log(await res.text())
throw new Error()
}

setForm({
name:"",
phone:"",
address:"",
email:"",
nick:"",
price:"",
month:"",
status:"не оплачено",
renewalDate:"",
renewalStatus:"не продлено",
comment:""
})

setEditingId(null)

loadClients()

}catch(e){

alert("Ошибка сохранения")

}

}



/* ---------- РЕДАКТИРОВАНИЕ ---------- */

function editClient(client:any){

setForm({
name:client.name || "",
phone:client.phone || "",
address:client.address || "",
email:client.email || "",
nick:client.nick || "",
price:String(client.price || ""),
month:client.month || "",
status:client.status || "не оплачено",
renewalDate:client.renewalDate || "",
renewalStatus:client.renewalStatus || "не продлено",
comment:client.comment || ""
})

setEditingId(client.id)

}



/* ---------- УДАЛЕНИЕ ---------- */

async function deleteClient(id:number){

if(!confirm("Удалить клиента?")) return

try{

const res = await fetch("/api/clients",{
method:"DELETE",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({ id })
})

if(!res.ok){
console.log(await res.text())
throw new Error()
}

loadClients()

}catch(err){

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
(c.nick ?? "").toLowerCase().includes(value) ||
(c.month ?? "").toLowerCase().includes(value)

if(monthFilter === "all") return match

const month = c.month?.split(".")[1]

return match && month === monthFilter

})



/* ---------- СТАТИСТИКА ---------- */

const income = filtered.reduce((sum:number,c:any)=>{

if(c.status === "оплачено"){
return sum + Number(c.price || 0)
}

return sum

},0)

const paid = filtered.filter(c=>c.status==="оплачено").length
const unpaid = filtered.filter(c=>c.status!=="оплачено").length
const renewed = filtered.filter(c=>c.renewalStatus==="продлил").length



return(

<div className="p-4 md:p-10 min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">

<div className="flex justify-between items-center mb-8">

<h1 className="text-3xl md:text-4xl font-bold">
📡 IDA TV: ADMIN
</h1>

<button
onClick={()=>{
localStorage.removeItem("admin")
router.push("/login")
}}
className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
>
Выйти
</button>

</div>



{/* СТАТИСТИКА */}

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">

<div className="bg-gray-800 p-5 rounded-xl">
<p className="text-gray-400">Клиентов</p>
<p className="text-2xl font-bold">{filtered.length}</p>
</div>

<div className="bg-green-700 p-5 rounded-xl">
<p>Оплачено</p>
<p className="text-2xl font-bold">{paid}</p>
</div>

<div className="bg-red-700 p-5 rounded-xl">
<p>Должники</p>
<p className="text-2xl font-bold">{unpaid}</p>
</div>

<div className="bg-blue-700 p-5 rounded-xl">
<p>Продлили</p>
<p className="text-2xl font-bold">{renewed}</p>
</div>

<div className="bg-yellow-500 p-5 rounded-xl text-black">
<p>Доход</p>
<p className="text-2xl font-bold">{income} €</p>
</div>

</div>



{/* ФОРМА */}

<div className="bg-slate-700 p-6 rounded-xl mb-10">

<h2 className="font-bold mb-6 text-xl text-purple-300">
➕ Добавить клиента
</h2>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

<input value={form.name} placeholder="Имя"
onChange={(e)=>setForm({...form,name:e.target.value})}
className="bg-white text-black p-2 rounded"/>

<input value={form.phone} placeholder="Телефон"
onChange={(e)=>setForm({...form,phone:e.target.value})}
className="bg-white text-black p-2 rounded"/>

<input value={form.address} placeholder="Адрес"
onChange={(e)=>setForm({...form,address:e.target.value})}
className="bg-white text-black p-2 rounded"/>

<input value={form.email} placeholder="Email"
onChange={(e)=>setForm({...form,email:e.target.value})}
className="bg-white text-black p-2 rounded"/>

<input value={form.nick} placeholder="Nick"
onChange={(e)=>setForm({...form,nick:e.target.value})}
className="bg-white text-black p-2 rounded"/>

<input value={form.price} placeholder="Сумма"
onChange={(e)=>setForm({...form,price:e.target.value})}
className="bg-white text-black p-2 rounded"/>

<input value={form.month} placeholder="Дата оплаты (11.03.2026)"
onChange={(e)=>setForm({...form,month:e.target.value})}
className="bg-white text-black p-2 rounded"/>

<input value={form.renewalDate} placeholder="Дата продления"
onChange={(e)=>setForm({...form,renewalDate:e.target.value})}
className="bg-white text-black p-2 rounded"/>

<select value={form.status}
onChange={(e)=>setForm({...form,status:e.target.value})}
className="bg-white text-black p-2 rounded">
<option value="не оплачено">не оплачено</option>
<option value="оплачено">оплачено</option>
</select>

<select value={form.renewalStatus}
onChange={(e)=>setForm({...form,renewalStatus:e.target.value})}
className="bg-white text-black p-2 rounded">
<option value="не продлено">не продлено</option>
<option value="продлил">продлил</option>
</select>

<textarea value={form.comment}
placeholder="Комментарий"
onChange={(e)=>setForm({...form,comment:e.target.value})}
className="bg-white text-black p-2 rounded col-span-3"/>

<button
type="button"
onClick={addClient}
className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg">
{editingId ? "Сохранить изменения" : "Добавить клиента"}
</button>

</div>

</div>



{/* СПИСОК КЛИЕНТОВ */}

<div className="bg-gray-800 rounded-xl overflow-x-auto">

<table className="w-full">

<thead className="bg-gray-700">

<tr>

<th className="p-3">Имя</th>
<th>Телефон</th>
<th>Адрес</th>
<th>Email</th>
<th>Nick</th>
<th>Сумма</th>
<th>Дата оплаты</th>
<th>Дата продления</th>
<th>Статус</th>
<th>Продление</th>
<th>Действия</th>

</tr>

</thead>

<tbody>

{filtered.map((c:any)=>(

<tr key={c.id} className="border-t border-gray-700 text-center">

<td className="p-2">{c.name}</td>
<td>{c.phone}</td>
<td>{c.address}</td>
<td>{c.email}</td>
<td>{c.nick}</td>
<td>{c.price} €</td>
<td>{c.month}</td>
<td>{c.renewalDate}</td>

<td>
<span className={
c.status==="оплачено"
? "bg-green-600 px-3 py-1 rounded-full"
: "bg-red-600 px-3 py-1 rounded-full"
}>
{c.status}
</span>
</td>

<td>
<span className={
c.renewalStatus==="продлил"
? "bg-green-600 px-3 py-1 rounded-full"
: "bg-red-600 px-3 py-1 rounded-full"
}>
{c.renewalStatus}
</span>
</td>

<td className="flex justify-center gap-2 p-2">

<button
onClick={()=>editClient(c)}
className="bg-yellow-500 p-2 rounded"
>
<Pencil size={16}/>
</button>

<button
onClick={()=>deleteClient(c.id)}
className="bg-red-600 p-2 rounded"
>
<Trash size={16}/>
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

)

}