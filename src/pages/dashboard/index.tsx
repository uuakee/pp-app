// src/pages/dashboard/index.tsx

import { BadgeHelp, Calendar, PlusCircle, ArrowDown, RefreshCw, Rocket } from "lucide-react";
import { Oswald } from 'next/font/google';
import { useEffect, useState } from 'react';
import Head from 'next/head'
import { useToast } from "@/hooks/use-toast";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NavBar from "@/components/common/nav-bar";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardNoShadow } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DialogSuccess from "@/components/common/dialog-sucess";

const oswald = Oswald({
    weight: '700',
    subsets: ['latin'],
});

interface Plan {
    id: number;
    name: string;
    image: string;
    price: number;
    duration: number;
    daily_roi: string;
    loops: number;
    vip_needed: string;
    status: boolean;
}

export default function Dashboard() {
    const [balances, setBalances] = useState({
        balance: 0,
        withdrawal_balance: 0
    });
    const [plans, setPlans] = useState<Plan[]>([]);
    const { toast } = useToast();
    const [dialogState, setDialogState] = useState({
        isOpen: false,
        type: 'success' as 'success' | 'error',
        operation: 'buy-plan' as const
    });
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchBalances = async () => {
        try {
            const userId = localStorage.getItem('id');
            const response = await fetch(`https://api.epiroc.lat/api/user/balance?id=${userId}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setBalances(data.data);
            }
        } catch (error) {
            console.error('Erro ao buscar saldos:', error);
        }
    };

    const fetchPlans = async () => {
        try {
            const response = await fetch('https://api.epiroc.lat/api/plan/all');
            if (response.ok) {
                const data = await response.json();
                setPlans(data);
            }
        } catch (error) {
            console.error('Erro ao buscar planos:', error);
        }
    };

    useEffect(() => {
        fetchBalances();
        fetchPlans();
        // Atualiza a cada 30 segundos
        const interval = setInterval(fetchBalances, 30000);
        return () => clearInterval(interval);
    }, [])

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchBalances();
        setIsRefreshing(false);
    };

    const handleBuyPlan = async (planId: number) => {
        try {
            const userId = localStorage.getItem('id');
            
            const response = await fetch('https://api.epiroc.lat/api/user/buy-plan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId,
                    planId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao comprar plano');
            }

            // Atualiza o saldo após a compra
            await fetchBalances();

            // Mostra diálogo de sucesso
            setDialogState({
                isOpen: true,
                type: 'success',
                operation: 'buy-plan'
            });

        } catch (error: any) {
            // Mostra diálogo de erro
            setDialogState({
                isOpen: true,
                type: 'error',
                operation: 'buy-plan'
            });
        }
    };

    return (
        <>
            <div className="m-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <Image src="/logotype.svg" alt="Collapse Logo" width={120} height={40} />  
                    <div className="flex gap-4 items-center">
                        <div className="flex items-center gap-1">
                            <a href="https://t.me/epirocglobal" target="_blank" className="flex items-center gap-1">
                                <BadgeHelp className="w-4 h-4 text-muted-foreground " />
                                <p className="text-xs text-muted-foreground">Tendo algum problema?</p>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Banner carousel */}
                <Carousel className="w-full max-w-lg mx-auto">
                    <CarouselContent>
                        <CarouselItem>
                            <div className="p-1">
                                <Card className="overflow-hidden">
                                    <div className="aspect-[16/9] relative">
                                        <Image 
                                            src="https://epiroc.scene7.com/is/image/epiroc/banner_accelerate?$landscape1600$" 
                                            alt="Banner 1"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </Card>
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <div className="p-1">
                                <Card className="overflow-hidden">
                                    <div className="aspect-[16/9] relative">
                                        <Image 
                                            src="https://epiroc.scene7.com/is/image/epiroc/3x_battery_machines_high_res?$landscape1600$" 
                                            alt="Banner 2"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </Card>
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <div className="p-1">
                                <Card className="overflow-hidden">
                                    <div className="aspect-[16/9] relative">
                                        <Image 
                                            src="https://epiroc.scene7.com/is/image/epiroc/Epiroc_B9391050-1?$landscape1600$&cropN=0.00,0.03,1.00,0.68" 
                                            alt="Banner 3"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </Card>
                            </div>
                        </CarouselItem>
                    </CarouselContent>
                </Carousel>

                <div className="flex justify-center items-center gap-2 mt-4">
                    <Image src="/chinese-coins.png" alt="Chinese Coin" width={32} height={32} />
                    <p className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                        Ganhe até 30% de bônus com suas indicações!
                    </p>
                    <Image src="/chinese-coins.png" alt="Chinese Coin" width={32} height={32} />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 items-center">
                    <CardNoShadow className="p-4">
                        <div className="flex flex-col">
                            <div className="flex items-center justify-between">
                                <p className="text-[12px] text-muted-foreground">
                                    Saldo
                                </p>
                                <button 
                                    onClick={handleRefresh}
                                    className="p-1 hover:bg-muted rounded-full transition-colors"
                                    disabled={isRefreshing}
                                >
                                    <RefreshCw className={`w-4 h-4 text-muted-foreground ${
                                        isRefreshing ? 'animate-spin' : ''
                                    }`} />
                                </button>
                            </div>
                            <p className={`text-2xl font-bold ${oswald.className}`}>
                                R$ {balances.balance.toFixed(2)}
                            </p>
                        </div>
                    </CardNoShadow>
                    <div className="flex flex-col gap-2">
                        <Button className="w-full bg-brand">
                            <PlusCircle className="w-4 h-4" />
                            Depositar
                        </Button>
                        <Button variant="outline" className="w-full">
                            Sacar
                        </Button>
                    </div>
                </div>

                <div className="mt-8">
                    <p className="text-sm text-muted-foreground mb-4">Ativos disponíveis</p>
                    <div className="grid grid-cols-1 gap-4 mb-20">
                        {plans.map((plan) => (
                            <CardNoShadow key={plan.id} className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center">
                                            <Image 
                                                src={plan.image} 
                                                alt={plan.name}
                                                width={24}
                                                height={24}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-medium">{plan.name}</h3>
                                            <p className="text-xs text-muted-foreground">
                                                Prazo de investimento: {plan.duration} dias
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Lucro líquido: R$ {parseFloat(plan.daily_roi).toFixed(2)}/dia
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`text-lg font-bold text-brand ${oswald.className}`}>
                                            R$ {plan.price}
                                        </span>
                                        <Button 
                                            className="bg-brand hover:bg-brand/90 text-xs"
                                            size="default"
                                            onClick={() => handleBuyPlan(plan.id)}
                                        >
                                            Investir
                                        </Button>
                                    </div>
                                </div>
                            </CardNoShadow>
                        ))}
                    </div>
                </div>

                <NavBar />
            </div>

            <DialogSuccess 
                isOpen={dialogState.isOpen}
                onClose={() => setDialogState(prev => ({ ...prev, isOpen: false }))}
                type={dialogState.type}
                operation={dialogState.operation}
            />
        </>
    )
}