import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="bg-paper min-h-[60vh] flex items-center">
        <div className="sc-container py-24 text-center">
          <p
            className="font-serif text-paper-2 select-none"
            style={{ fontSize: 120, fontWeight: 420, lineHeight: 1, letterSpacing: '-0.04em' }}
            aria-hidden="true"
          >
            404
          </p>
          <h1 className="sc-h2 -mt-6">Page not found</h1>
          <p className="text-muted text-[16px] mt-4 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link href="/" className="btn-primary">
            ← Back to homepage
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
