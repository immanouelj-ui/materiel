import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'VOLT — L’exigence électrique.', description: 'Matériel électrique, éclairage et appareillage. Explorez le catalogue VOLT et composez votre sélection.' };
export default function Layout({children}:Readonly<{children:React.ReactNode}>) { return <html lang="fr"><body>{children}</body></html>; }
