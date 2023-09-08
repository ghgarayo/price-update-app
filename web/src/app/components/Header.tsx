import Link from 'next/link'

const links = [
  { name: 'Tabela de Preços', href: '/' },
  { name: 'Upload de Arquivo', href: '/UploadCsv' },
]

export default function Header() {
  return (
    <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-10">
      <div
        className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
        aria-hidden="true"
      ></div>
      <div
        className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
        aria-hidden="true"
      ></div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-6xl lg:mx-0">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Atualização Massiva de Preços
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-300"></p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold leading-7 text-white sm:grid-cols-2 md:flex lg:gap-x-10">
            {links.map((link) => (
              <Link key={link.name} href={link.href}>
                {link.name} <span aria-hidden="true">&rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
