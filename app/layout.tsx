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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        {children}
      </body>
    </html>
  )
}