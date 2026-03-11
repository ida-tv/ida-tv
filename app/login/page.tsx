"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Login(){

const [password,setPassword] = useState("")
const router = useRouter()

async function login(){

const res = await fetch("/api/login",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({password})
})

if(res.ok){

localStorage.setItem("admin","true")
router.push("/admin")

}else{

alert("Неверный пароль")

}

}

return(

<div className="flex items-center justify-center h-screen bg-black text-white">

<div className="bg-gray-800 p-8 rounded-lg w-80">

<h1 className="text-xl mb-4 text-center">
🔐 IDA TV ADMIN
</h1>

<input
type="password"
placeholder="Введите пароль"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="w-full p-2 rounded text-black mb-4"
/>

<button
onClick={login}
className="w-full bg-blue-600 p-2 rounded">

Войти

</button>

</div>

</div>

)

}