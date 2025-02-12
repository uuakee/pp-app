import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Copy, Check } from "lucide-react";
import Image from "next/image";
import { Oswald } from "next/font/google";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CardContent, CardDescription, CardNoShadow, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/common/nav-bar";
const oswald = Oswald({
    weight: '700',
    subsets: ['latin'],
});

interface User {
    referal_code: string;
    referal_count: number;
    referal_investments: number;
    referal_deposits: number;
    referal_bonus: number;
    vip_type: 'VIP_0' | 'VIP_1' | 'VIP_2' | 'VIP_3';
}

const formatVipLevel = (vipType: string) => {
    // Extrai o número do final (0, 1, 2, 3)
    const level = vipType.split('_')[1];
    return `VIP ${level}`;
};

export default function Referal() {
    const [user, setUser] = useState<User>({
        referal_code: '',
        referal_count: 0,
        referal_investments: 0,
        referal_deposits: 0,
        referal_bonus: 0,
        vip_type: 'VIP_0'
    });
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

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

    const handleCopy = async () => {
        const referalLink = `https://epiroc.lat/auth/register?r=${user.referal_code}`;
        
        try {
            // Cria um elemento temporário
            const textArea = document.createElement('textarea');
            textArea.value = referalLink;
            
            // Torna o elemento invisível
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            
            // Seleciona e copia
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            
            // Remove o elemento temporário
            document.body.removeChild(textArea);

            // Feedback visual
            setCopied(true);
            toast({
                description: "Link copiado com sucesso!"
            });

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (err) {
            toast({
                variant: "destructive",
                description: "Erro ao copiar link"
            });
        }
    };

    const referalLink = isLoading 
        ? 'Carregando...' 
        : `https://epiroc.lat/auth/register?r=${user.referal_code}`;

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
                        Referências
                    </p>
                </div>
            </div>
            <div className="mt-8">
                <div>
                    <h1 className={`text-2xl font-bold text-center ${oswald.className}`}>
                        Compartilhe e ganhe até{' '}
                        <span className="bg-brand text-white px-2 py-0.5 rounded-md">
                            30%
                        </span>
                        {' '}de bônus com suas indicações!
                    </h1>
                    <p className="text-sm text-muted-foreground text-center mt-4 w-[90%] mx-auto">
                        Crie sua rede de indicações e suba de nível VIP para poder cada vez mais ganhar, em caso de dúvidas entre em contato com o suporte.
                    </p>
                </div>
            </div>
            <div className="mt-4">
                <div className="flex justify-center items-center gap-2">
                    <Input
                        type="text"
                        value={referalLink}
                        className="w-[100%] h-10"
                        readOnly
                    />
                    <Button 
                        className="h-10 bg-brand" 
                        onClick={handleCopy}
                        disabled={isLoading}
                    >
                        {copied ? (
                            <Check className="w-4 h-4" />
                        ) : (
                            <Copy className="w-4 h-4" />
                        )}
                    </Button>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground text-center mt-4 w-[90%] mx-auto">
                        Seu código de indicação é: <span className="font-bold text-brand">{user.referal_code}</span>
                    </p>
                </div>
                <div className="mt-8">
                    <div className="grid grid-cols-2 gap-4 mb-20">
                        <CardNoShadow className="p-4">
                            <div className="flex flex-col">
                                <CardTitle className="text-sm font-medium p-0">
                                    Membros convidados
                                </CardTitle>
                                <div className="mt-2">
                                    <p className={`text-2xl font-bold ${oswald.className}`}>
                                        <span className="text-brand">{user.referal_count}</span>
                                        <span className="text-sm font-normal text-muted-foreground ml-1">
                                            membros
                                        </span>
                                    </p>
                                </div>
                                <CardDescription className="text-xs mt-2 text-muted-foreground">
                                    Você convida amigos e ganhe de bônus por cada indicação no VIP atual.
                                </CardDescription>
                            </div>
                        </CardNoShadow>

                        <CardNoShadow className="p-4">
                            <div className="flex flex-col">
                                <CardTitle className="text-sm font-medium p-0">
                                    Total de bônus
                                </CardTitle>
                                <div className="mt-2">
                                    <p className={`text-2xl font-bold ${oswald.className}`}>
                                        <span className="text-brand">
                                            R$ {(user.referal_bonus / 100).toFixed(2)}
                                        </span>
                                    </p>
                                </div>
                                <CardDescription className="text-xs mt-2 text-muted-foreground">
                                    Esse é o total de bônus que você ganhou com suas indicações no nível {formatVipLevel(user.vip_type)}.
                                </CardDescription>
                            </div>
                        </CardNoShadow>
                        <CardNoShadow className="p-4">
                            <div className="flex flex-col">
                                <CardTitle className="text-sm font-medium p-0">
                                    Total de investimentos 
                                </CardTitle>
                                <div className="mt-2">
                                    <p className={`text-2xl font-bold ${oswald.className}`}>
                                        <span className="text-brand">{user.referal_investments}</span>
                                    </p>
                                </div>
                                <CardDescription className="text-xs mt-2 text-muted-foreground">
                                    Esse é o total de investimentos que seus indicados fizeram.
                                </CardDescription>
                            </div>
                        </CardNoShadow>
                        <CardNoShadow className="p-4">
                            <div className="flex flex-col">
                                <CardTitle className="text-sm font-medium p-0">
                                    Total de depósitos
                                </CardTitle>
                                <div className="mt-2">
                                    <p className={`text-2xl font-bold ${oswald.className}`}>
                                        <span className="text-brand">
                                            R$ {(user.referal_deposits / 100).toFixed(2)}
                                        </span>
                                    </p>
                                </div>
                                <CardDescription className="text-xs mt-2 text-muted-foreground">
                                    Esse é o total de depósitos que seus indicados fizeram.
                                </CardDescription>
                            </div>
                        </CardNoShadow>
                    </div>
                </div>
            </div>
            <Navbar />
        </div>
    )
}