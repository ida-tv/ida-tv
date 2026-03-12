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

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

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

<div className="bg-yellow-500 p-5 rounded-xl text-black">
<p>Доход</p>
<p className="text-2xl font-bold">{income} €</p>
</div>

</div>


{/* ПОИСК */}

<div className="flex flex-col md:flex-row gap-4 mb-8">

<input
placeholder="Поиск клиента..."
className="bg-gray-800 border border-gray-700 p-3 rounded-lg w-full md:w-72"
onChange={(e)=>setSearch(e.target.value)}
/>

<select
className="bg-gray-800 border border-gray-700 p-3 rounded-lg"
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

<input value={form.month} placeholder="Дата (11.03.2026)"
onChange={(e)=>setForm({...form,month:e.target.value})}
className="bg-white text-black p-2 rounded"/>

<select value={form.status}
onChange={(e)=>setForm({...form,status:e.target.value})}
className="bg-white text-black p-2 rounded">

<option value="не оплачено">не оплачено</option>
<option value="оплачено">оплачено</option>

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

</div>

)

}