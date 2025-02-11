import Link from 'next/link'
import { User, Home, Settings, UserPlus, ChartBarBigIcon, Gift } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function NavBar() {
    const pathname = usePathname()

    const isActive = (path: string) => {
        return pathname === path
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-center">
            <div className="bg-brand rounded-full px-8 py-2 flex items-center gap-8 text-white">
                <Link 
                    href="/dashboard" 
                    className={cn(
                        "flex flex-col items-center gap-1 transition-colors",
                        isActive('/dashboard') ? "text-black" : "text-white"
                    )}
                >
                    <Home className="w-5 h-5" />
                    <span className="text-xs">Lar</span>
                </Link>

                <Link 
                    href="/investments" 
                    className={cn(
                        "flex flex-col items-center gap-1 transition-colors",
                        isActive('/investments') ? "text-black" : "text-white"
                    )}
                >
                    <ChartBarBigIcon className="w-5 h-5" />
                    <span className="text-xs">Investimentos</span>
                </Link>

                <Link 
                    href="/referal" 
                    className={cn(
                        "flex flex-col items-center gap-1 transition-colors",
                        isActive('/referal') ? "text-black" : "text-white"
                    )}
                >
                    <Gift className="w-5 h-5" />
                    <span className="text-xs">Convidar</span>
                </Link>

                <Link 
                    href="/profile" 
                    className={cn(
                        "flex flex-col items-center gap-1 transition-colors",
                        isActive('/profile') ? "text-black" : "text-white"
                    )}
                >
                    <User className="w-5 h-5" />
                    <span className="text-xs">Perfil</span>
                </Link>
            </div>
        </div>
    )
}