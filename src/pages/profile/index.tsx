import { ArrowLeft, DollarSign, ArrowDown, MessageCircle, Info, Settings, Lock, Wallet, LogOut } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/common/nav-bar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

import { Oswald } from "next/font/google";
import { CardContent, CardDescription, CardNoShadow, CardTitle } from "@/components/ui/card";

const oswald = Oswald({
    weight: "700",
    subsets: ["latin"],
});

interface User {
    phone: string;
    balance: number;
    vip_type: 'VIP_0' | 'VIP_1' | 'VIP_2' | 'VIP_3';
}

const formatVipLevel = (vipType: string) => {
    const level = vipType.split('_')[1];
    return level;
};

const formatPhoneNumber = (phone: string) => {
    // Remove qualquer caractere não numérico
    const numbers = phone.replace(/\D/g, '');
    
    // Remove o 55 do início se existir
    const cleanNumber = numbers.startsWith('55') ? numbers.slice(2) : numbers;
    
    // Formata o número (XX) XXXXX-XXXX
    return cleanNumber.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};

export default function Profile() {
    const [user, setUser] = useState<User>({
        phone: '',
        balance: 0,
        vip_type: 'VIP_0'
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchUser = async () => {
        try {
            setIsLoading(true);
            const userId = localStorage.getItem('id');
            const response = await fetch(`https://api.epiroc.lat/api/user/info/${userId}`);
            
            if (response.ok) {
                const data = await response.json();
                setUser(data);
            }
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

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
                    <Image src="/collapse_logo.svg" alt="Collapse Logo" width={40} height={40} />
                </div>
                <div className="col-span-1 flex justify-end">
                    <p className="text-xs text-muted-foreground">
                        Perfil
                    </p>
                </div>
            </div>
            <div className="mt-8 mb-32">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Avatar className="w-12 h-12 rounded-md">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col ml-4">
                            <h1 className={`text-xl font-bold flex items-center ${oswald.className}`}>
                                <span className="text-xs text-muted-foreground mr-1">+55</span>
                                {formatPhoneNumber(user.phone)}
                            </h1>
                            <p className={`text-sm text-muted-foreground`}>
                                Saldo: R$ {(user.balance).toFixed(2)}
                            </p>
                        </div>
                    </div>
                    <div className="flex ml-4 items-center justify-end">
                        <Image 
                            src={`/vip-icon-${formatVipLevel(user.vip_type)}.png`} 
                            alt={`VIP ${formatVipLevel(user.vip_type)}`} 
                            width={80} 
                            height={40} 
                        />
                    </div>
                </div>
                <div className="mt-8 grid grid-cols-4 gap-4">
                    <div className="col-span-1 flex flex-col items-center gap-1">
                        <Button className="flex flex-col p-4 bg-brand">
                            <a href="/deposit">
                                <DollarSign className="w-5 h-5" />
                            </a>
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            Depositar
                        </p>
                    </div>
                    <div className="col-span-1 flex flex-col items-center gap-1">
                        <Button className="flex flex-col p-4 bg-slate-600">
                            <a href="/realease">
                                <ArrowDown className="w-5 h-5" />
                            </a>
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            Retirar
                        </p>
                    </div>
                    <div className="col-span-1 flex flex-col items-center gap-1">
                        <Button className="flex flex-col p-4 bg-blue-600">
                            <a href="/realease">
                                <MessageCircle className="w-5 h-5" />
                            </a>
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            Suporte
                        </p>
                    </div>
                    <div className="col-span-1 flex flex-col items-center gap-1">
                        <Button className="flex flex-col p-4 bg-green-500">
                            <a href="/realease">
                                <Info className="w-5 h-5" />
                            </a>
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            Sobre nós
                        </p>
                    </div>
                </div>
                <div className="mt-8">
                    <CardNoShadow className="">
                        <CardTitle>
                            <h1 className={`text-xl font-bold ${oswald.className}`}>
                                Configurações
                            </h1>
                        </CardTitle>
                        <CardContent className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 border border-slate-200 p-2 rounded-md">
                                <div className="w-fit gap-2 bg-brand p-2 rounded-md">
                                    <Wallet className="w-5 h-5 text-[#b28a1a]" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Carteira
                                </p>
                            </div>
                        <div className="flex items-center gap-2 border border-slate-200 p-2 rounded-md">
                                <div className="w-fit gap-2 bg-brand p-2 rounded-md">
                                    <DollarSign className="w-5 h-5 text-[#b28a1a]" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Registro de depósitos
                                </p>
                            </div>
                            <div className="flex items-center gap-2 border border-slate-200 p-2 rounded-md">
                                <div className="w-fit gap-2 bg-brand p-2 rounded-md">
                                    <ArrowDown className="w-5 h-5 text-[#b28a1a]" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Registro de saques
                                </p>
                            </div>
                            <div className="flex items-center gap-2 border border-slate-200 p-2 rounded-md">
                                <div className="w-fit gap-2 bg-brand p-2 rounded-md">
                                    <Lock className="w-5 h-5 text-[#b28a1a]" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Alterar senha
                                </p>
                            </div>
                            <div className="flex items-center gap-2 border border-slate-200 p-2 rounded-md">
                                <div className="w-fit gap-2 bg-red-500 p-2 rounded-md">
                                    <LogOut className="w-5 h-5 text-red-700" />
                                </div>  
                                <p className="text-sm text-muted-foreground">
                                    Sair
                                </p>
                            </div>

                        </CardContent>
                    </CardNoShadow>
                    <div className="mt-4">
                        <p className="text-xs text-muted-foreground text-center">
                            Versão 1.0.0 ~ EPIROC LATAM 2025 © Todos os direitos reservados
                        </p>
                    </div>
                </div>
            </div>
            <Navbar />
        </div>
    );
}