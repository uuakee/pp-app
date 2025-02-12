import { Badge } from "@/components/ui/badge";
import { CardNoShadow } from "@/components/ui/card";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { Oswald } from "next/font/google";
import Image from "next/image";
import { useEffect, useState } from "react";

const oswald = Oswald({
    subsets: ['latin'],
    weight: ['700'],
    variable: '--font-oswald',
})

interface Deposit {
    id: number;
    external_id: string;
    user_id: number;
    amount: number;
    status: 'waiting_payment' | 'approved' | 'pending' | 'refused';
    type: 'DEPOSIT';
    created_at: string;
    updated_at: string;
}

export default function Deposits() {
    const [deposits, setDeposits] = useState<Deposit[]>([]);

    useEffect(() => {
        const fetchDeposits = async () => {
            try {
                const userId = localStorage.getItem('id');
                
                console.log('UserId do localStorage:', userId);
                
                if (!userId) {
                    console.log('Usuário não autenticado');
                    return;
                }

                console.log('Fazendo requisição para:', `https://api.epiroc.lat/api/user/deposits/${userId}`);
                const response = await fetch(`https://api.epiroc.lat/api/user/deposits/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.status}`);
                }

                const data = await response.json();
                console.log('Resposta da API:', data);
                
                setDeposits(data);
            } catch (error) {
                console.error('Erro ao buscar depósitos:', error);
            }
        };

        fetchDeposits();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const formatStatus = (status: string) => {
        switch (status) {
            case 'approved':
                return { text: 'Aprovado', class: 'bg-green-500' };
            case 'waiting_payment':
                return { text: 'Aguardando', class: 'bg-yellow-500' };
            case 'pending':
                return { text: 'Pendente', class: 'bg-blue-500' };
            case 'refused':
                return { text: 'Recusado', class: 'bg-red-500' };
            default:
                return { text: status, class: 'bg-gray-500' };
        }
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
                    <Image src="/collapse_logo.svg" alt="Collapse Logo" width={40} height={40} />
                </div>
                <div className="col-span-1 flex justify-end">
                    <p className="text-xs text-muted-foreground">
                        Registros
                    </p>
                </div>
            </div>
            <div className="mt-4">
                <h1 className="text-2xl font-bold">
                    Registros
                </h1>
                <p className="text-sm text-muted-foreground">
                    Histórico de depósitos
                </p>
            </div>
            <div className="mt-4 space-y-4">
                {deposits.map((deposit) => (
                    <CardNoShadow key={deposit.id} className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-brand rounded-full w-fit">
                                    <PlusCircle className="w-5 h-5 text-[#b28a1a]" />
                                </div>
                                <div>
                                    <p className="text-md text-slate-900">
                                        Depósito
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Data: {formatDate(deposit.created_at)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <p className={`text-lg text-slate-900 ${oswald.className}`}>
                                    R$ {(deposit.amount / 100).toFixed(2)}
                                </p>
                                <Badge 
                                    variant="outline" 
                                    className={`${formatStatus(deposit.status).class} text-white`}
                                >
                                    {formatStatus(deposit.status).text}
                                </Badge>
                            </div>
                        </div>
                    </CardNoShadow>
                ))}
                
                {deposits.length === 0 && (
                    <p className="text-center text-muted-foreground">
                        Nenhum depósito encontrado
                    </p>
                )}
            </div>
        </div>
    )
}