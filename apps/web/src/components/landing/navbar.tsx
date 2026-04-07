import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Studeo</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
              Fonctionnalités
            </Link>
            <Link href="#how-it-works" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
              Comment ça marche
            </Link>
            <Link href="/auth/login" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              Se connecter
            </Link>
            <Link href="/auth/register" className="btn-primary text-sm py-2 px-4">
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
