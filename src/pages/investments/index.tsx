import NavBar from "@/components/common/nav-bar";
import { Badge } from "@/components/ui/badge";
import { CardNoShadow } from "@/components/ui/card";
import { ArrowLeft, Timer } from "lucide-react";
import { Oswald } from "next/font/google";
import Image from "next/image";
import { useEffect, useState } from "react";
import { withAuth } from '@/components/auth/protected-route';

interface Investment {
    id: number;
    user_id: number;
    plan_id: number;
    price: number;
    buy_date: string;
    end_date: string;
    plan: {
        id: number;
        name: string;
        image: string;
        daily_roi: string;
        duration: number;
        price: number;
        loops: number;
        vip_needed: string;
        status: boolean;
    }
}
const oswald = Oswald({
    weight: '700',
    subsets: ['latin'],
});

function Investments() {
    const [investments, setInvestments] = useState<Investment[]>([]);
    

    const fetchInvestments = async () => {
        try {
            const userId = localStorage.getItem('id');
            const response = await fetch(`https://api.epiroc.lat/api/user/plans/${userId}`);
            
            if (response.ok) {
                const data = await response.json();
                setInvestments(data);
            }
        } catch (error) {
            console.error('Erro ao buscar investimentos:', error);
        }
    };

    useEffect(() => {
        fetchInvestments();
    }, []);

    // Calcula dias restantes
    const getRemainingDays = (endDate: string) => {
        const end = new Date(endDate);
        const now = new Date();
        const diff = end.getTime() - now.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="m-4">
            <div className="grid grid-cols-3 gap-4 items-center">
                {/* Voltar para a página anterior */}
                <div className="col-span-1">
                    <a href="/dashboard">
                        <ArrowLeft className="w-4 h-4" />
                    </a>
                </div>
                <div className="col-span-1 flex justify-center items-center">
                    <Image src="/logotype.svg" alt="Epiroc Global" width={120} height={40} />
                </div>
                <div className="col-span-1 flex justify-end">
                    <a href="/payments">
                        <Badge variant="outline">
                            Registros
                        </Badge>
                    </a>
                </div>
            </div>

            <div className="mt-8 mb-4">
                <h1 className="text-md font-bold">
                    Investimentos em andamento
                </h1>
                <p className="text-sm text-muted-foreground">
                    Aqui você pode ver todos os investimentos em andamento.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-20">
                {investments.map((investment) => (
                    <CardNoShadow key={investment.id} className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center">
                                    <Image 
                                        src={investment.plan.image} 
                                        alt={investment.plan.name}
                                        width={24}
                                        height={24}
                                    />
                                </div>
                                <div>
                                    <h3 className="font-medium">{investment.plan.name}</h3>
                                    <p className="text-xs text-muted-foreground">
                                        Rendimento diário: R$ {parseFloat(investment.plan.daily_roi).toFixed(2)}
                                    </p>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Timer className="w-3 h-3" />
                                        <span>
                                            {getRemainingDays(investment.end_date)} dias restantes 
                                            ({new Date(investment.end_date).toLocaleDateString()})
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className={`text-sm font-bold text-brand ${oswald.className}`}>
                                    R$ {investment.price.toFixed(2)}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                    Ativo
                                </Badge>
                            </div>
                        </div>
                    </CardNoShadow>
                ))}

                {investments.length === 0 && (
                    <div className="text-center text-muted-foreground text-sm">
                        Nenhum investimento ativo no momento.
                    </div>
                )}
            </div>

            <NavBar />
        </div>
    );
}

export default withAuth(Investments);