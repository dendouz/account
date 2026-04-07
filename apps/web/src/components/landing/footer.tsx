import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-white">Studeo</span>
            </div>
            <p className="text-sm leading-relaxed">
              L&apos;application qui simplifie l&apos;admin des étudiants belges. Conçue en Belgique, pour la Belgique.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Produit</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#features" className="hover:text-white transition-colors">Fonctionnalités</Link></li>
              <li><Link href="#how-it-works" className="hover:text-white transition-colors">Comment ça marche</Link></li>
              <li><Link href="/support" className="hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Ressources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://studentatwork.be" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Student@work</a></li>
              <li><a href="https://fin.belgium.be" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">SPF Finances</a></li>
              <li><a href="https://www.rsvz-inasti.fgov.be" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">INASTI</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Légal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Politique de confidentialité</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Conditions d&apos;utilisation</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">Politique de cookies</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Studeo. Tous droits réservés. Fait avec soin en Belgique.</p>
          <p className="mt-2 text-xs text-gray-500">
            Studeo fournit des estimations et informations à titre indicatif. Pour toute question fiscale ou juridique,
            consultez un professionnel agréé.
          </p>
        </div>
      </div>
    </footer>
  );
}
