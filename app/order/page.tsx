"use client"

import { useForm } from "react-hook-form"
import { useState } from "react"

type FormData = {
  firstName: string
  lastName: string
  phone: string
  email: string
  city: string
  customCity: string
  address: string
  connection: string
  devices: string
  deviceType: string
}

export default function OrderPage() {

  const { register, handleSubmit, watch, reset, formState:{errors} } = useForm<FormData>()
  const selectedCity = watch("city")
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const onSubmit = async (data: FormData) => {

    const finalCity = data.city === "other" ? data.customCity : data.city

    setLoading(true)

    await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        city: finalCity
      })
    })

    reset()
    setLoading(false)
    setShowModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center px-4 py-10 text-white">

      <div className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl p-8 w-full max-w-xl border border-white/20">

        {/* LOGO */}
        <img
          src="/logo.png"
          alt="IDA TV"
          className="w-80 mx-auto mb-6"
        />

        <h1 className="text-3xl font-bold text-center mb-6">
          Страница заявки услуги от IDA TV
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <input
            placeholder="Имя"
            {...register("firstName",{required:true})}
            className="bg-white text-black rounded-lg p-3 w-full"
          />
          {errors.firstName && <p className="text-red-400">Обязательное поле</p>}

          <input
            placeholder="Фамилия"
            {...register("lastName",{required:true})}
            className="bg-white text-black rounded-lg p-3 w-full"
          />
          {errors.lastName && <p className="text-red-400">Обязательное поле</p>}

          <input
            placeholder="Телефон"
            {...register("phone",{required:true})}
            className="bg-white text-black rounded-lg p-3 w-full"
          />
          {errors.phone && <p className="text-red-400">Обязательное поле</p>}

          <input
            placeholder="Email"
            {...register("email",{required:true})}
            className="bg-white text-black rounded-lg p-3 w-full"
          />
          {errors.email && <p className="text-red-400">Обязательное поле</p>}

          <select
            {...register("city",{required:true})}
            className="bg-white text-black rounded-lg p-3 w-full"
          >
            <option value="">Выберите город</option>
            <option>Таллинн</option>
            <option>Нарва</option>
            <option>Йыхви</option>
            <option>Кохтла-Ярве</option>
            <option>Силламяэ</option>
            <option value="other">Моего города нет</option>
          </select>
          {errors.city && <p className="text-red-400">Выберите город</p>}

          {selectedCity === "other" && (
            <>
              <input
                placeholder="Введите ваш город"
                {...register("customCity",{required:true})}
                className="bg-white text-black rounded-lg p-3 w-full"
              />
              {errors.customCity && <p className="text-red-400">Введите город</p>}
            </>
          )}

          {/* АДРЕС ПОДКЛЮЧЕНИЯ */}
          <input
            placeholder="Адрес подключения (улица, дом, квартира)"
            {...register("address",{required:true})}
            className="bg-white text-black rounded-lg p-3 w-full"
          />
          {errors.address && <p className="text-red-400">Введите адрес подключения</p>}

          <select
            {...register("connection",{required:true})}
            className="bg-white text-black rounded-lg p-3 w-full"
          >
            <option value="">Тип подключения</option>
            <option>Плейлист — 25€</option>
            <option>Подключение на месте — 75–125€</option>
            <option>Удалённая настройка — 65€</option>
            <option>Аренда оборудования — 15€/мес</option>
            <option>Вызов техника — 15€</option>
          </select>

          <select
            {...register("devices",{required:true})}
            className="bg-white text-black rounded-lg p-3 w-full"
          >
            <option value="">Количество устройств</option>
            <option value="1">1 устройство</option>
            <option value="2">2 устройства</option>
            <option value="3">3 устройства</option>
            <option value="4">4 устройства</option>
            <option value="5">5 устройств</option>
          </select>

          <select
            {...register("deviceType",{required:true})}
            className="bg-white text-black rounded-lg p-3 w-full"
          >
            <option value="">Тип устройства</option>
            <option>Телевизор Smart TV</option>
            <option>Android TV</option>
            <option>Телефон</option>
            <option>ПК</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="bg-white text-black hover:bg-gray-300 p-3 rounded-lg w-full text-lg font-bold"
          >
            {loading ? "Отправка..." : "Отправить заявку"}
          </button>

        </form>

      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white text-black p-10 rounded-2xl max-w-md text-center shadow-2xl space-y-5">

            <h2 className="text-2xl font-bold">
              Здравствуйте,
            </h2>

            <p className="text-xl">
              Мы получили вашу заявку ✅
            </p>

            <p>
              Она будет обработана в ближайшее время.<br/>
              Мы свяжемся с вами по указанному телефону.
            </p>

            <p className="font-semibold">
              С уважением<br/>
              Info IDA TV<br/>
              📧 ida.tv@bk.ru
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-black text-white px-6 py-3 rounded-lg"
            >
              Закрыть
            </button>

          </div>
        </div>
      )}

    </div>
  )
}