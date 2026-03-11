"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLogin(){

const [password,setPassword] = useState("")
const router = useRouter()

const login = () => {

const ADMIN_PASSWORD = "12345"

if(password === ADMIN_PASSWORD){

localStorage.setItem("admin","true")
localStorage.setItem("loginTime", new Date().toLocaleString())

router.push("/admin")

}else{

alert("Неверный пароль")

}

}

return(

<div className="min-h-screen flex items-center justify-center bg-black text-white">

<div className="bg-white/10 p-10 rounded-xl space-y-4 w-80">

<h1 className="text-2xl font-bold text-center">
IDA TV ADMIN
</h1>

<input
type="password"
placeholder="Введите пароль"
className="w-full p-3 text-black rounded"
onChange={(e)=>setPassword(e.target.value)}
/>

<button
onClick={login}
className="bg-white text-black w-full p-3 rounded font-bold"
>
Войти
</button>

</div>

</div>

)

}