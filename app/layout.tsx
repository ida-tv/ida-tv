export const metadata = {
  title: "IDA TV IPTV",
  description: "Подключение IPTV и настройка Smart TV",
  openGraph: {
    title: "IDA TV IPTV",
    description: "Подключение IPTV и настройка Smart TV",
    url: "https://setuptv.online",
    siteName: "IDA TV",
    images: [
      {
        url: "/preview.jpg",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">

      <body>

        {/* МЕНЮ */}
        <nav style={{
          display:"flex",
          gap:"20px",
          padding:"20px",
          background:"#000",
          color:"#fff"
        }}>

          <a href="/order">Главная</a>

          <a href="https://www.ida-tv.eu/Наши-услуги-1" target="_blank">
            Услуги
          </a>

          <a href="/order">
            Подключение
          </a>

          <a href="/feedback">
            Обратная связь
          </a>

          <a href="/contacts">
            Контакты
          </a>

        </nav>

        {/* СТРАНИЦЫ */}
        {children}

      </body>

    </html>
  )
}