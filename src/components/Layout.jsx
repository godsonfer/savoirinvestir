import Head from 'next/head'

function Layout({ children, pageTitle }) {
  const title = pageTitle 
    ? `${pageTitle} | INVEST MASTERY MIND`
    : 'INVEST MASTERY MIND'

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content="INVEST MASTERY MIND - Votre plateforme d'investissement" />
      </Head>
      <header>
        <h1>INVEST MASTERY MIND</h1>
      </header>
      <main>
        {children}
      </main>
    </div>
  )
}

export default Layout 
