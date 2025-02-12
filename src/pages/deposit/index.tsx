import { ArrowLeft, DollarSign } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent, CardDescription, CardNoShadow, CardTitle } from "@/components/ui/card";
import { Oswald } from "next/font/google";
import { useState } from "react";
import { withAuth } from '@/components/auth/protected-route';
import { toast, Toaster } from 'react-hot-toast';

const oswald = Oswald({
    weight: "700",
    subsets: ["latin"],
});

const presetValues = [
    { value: 80, label: 'R$ 80' },
    { value: 100, label: 'R$ 100' },
    { value: 150, label: 'R$ 150' },
    { value: 200, label: 'R$ 200' },
    { value: 250, label: 'R$ 250' },
    { value: 300, label: 'R$ 300' },
    { value: 400, label: 'R$ 400' },
];

function Deposit() {
    const [selectedValue, setSelectedValue] = useState<number>(0);
    const [customValue, setCustomValue] = useState<string>('');

    const handlePresetClick = (value: number) => {
        setSelectedValue(value);
        setCustomValue(formatCurrency(value * 100)); // Multiplica por 100 para converter para centavos
    };

    const formatCurrency = (value: number): string => {
        return `R$ ${(value / 100).toFixed(2).replace('.', ',')}`;
    };

    const handleCustomValueChange = (value: string) => {
        // Remove tudo que não é número
        const numbers = value.replace(/\D/g, '');
        if (numbers) {
            setCustomValue(formatCurrency(parseInt(numbers)));
            setSelectedValue(0); // Limpa a seleção dos botões
        } else {
            setCustomValue('');
        }
    };

    const handleSubmit = async () => {
        try {
            const amountInCents = parseInt(customValue.replace(/\D/g, ''));
            
            if (!amountInCents || amountInCents < 8000) {
                toast.error('Valor mínimo de depósito é R$ 80,00');
                return;
            }

            const userId = localStorage.getItem('id');
            if (!userId) {
                toast.error('Usuário não autenticado');
                return;
            }

            const loadingToast = toast.loading('Gerando pagamento...');

            const response = await fetch('https://api.epiroc.lat/api/gateway/deposit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: amountInCents,
                    userId: parseInt(userId)
                })
            });

            const data = await response.json();
            toast.dismiss(loadingToast);

            if (!response.ok) {
                toast.error(data.details || data.error || 'Erro ao gerar pagamento');
                return;
            }

            toast.success('Pagamento gerado com sucesso!');
            
            // Aguarda 1 segundo e redireciona
            setTimeout(() => {
                const amountInReais = data.amount / 100; // Converte centavos para reais
                const payUrl = `https://pix.onepyg.com/PixPay.html?cid=${encodeURIComponent(data.expirationDate)}&amount=${amountInReais}&qrcode=${encodeURIComponent(data.qrcode)}`;
                window.location.href = payUrl;
            }, 1000);

        } catch (error: any) {
            console.error('Erro:', error);
            toast.error(error.message || 'Erro ao gerar pagamento');
        }
    };

    return (
        <div className="m-4">
            <Toaster position="top-center" />
            
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
                        Depositar
                    </p>
                </div>
            </div>

            <div className="mt-8">
                <div className="relative">
                    <DollarSign className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 transform -translate-y-1/2" />
                    <Input
                        type="text"
                        value={customValue}
                        onChange={(e) => handleCustomValueChange(e.target.value)}
                        placeholder="Recarga mín. R$ 80,00"
                        className="text-start text-sm h-12 pl-12"
                    />
                </div>

                <div className="mt-4 grid grid-cols-4 gap-4">
                    {presetValues.map((preset) => (
                        <Button
                            key={preset.value}
                            onClick={() => handlePresetClick(preset.value)}
                            variant={selectedValue === preset.value ? "default" : "outline"}
                            className={`w-full ${selectedValue === preset.value ? 'bg-brand' : ''}`}
                        >
                            {preset.label}
                        </Button>
                    ))}
                </div>

                <Button 
                    className="w-full mt-8 bg-brand h-12"
                    onClick={handleSubmit}
                >
                    Efetuar recarga
                </Button>

                <CardNoShadow className="mt-8">
                    <CardTitle>
                        <h2 className={`text-lg font-bold ${oswald.className}`}>
                            Instruções para recarga:
                        </h2>
                    </CardTitle>
                    <CardContent className="flex flex-col gap-4 mt-4">
                        <div className="flex items-start gap-2">
                            <span className="font-bold">1.</span>
                            <p className="text-sm text-muted-foreground">
                                O valor mínimo do depósito é de R$ 80.
                            </p>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="font-bold">2.</span>
                            <p className="text-sm text-muted-foreground">
                                Verifique cuidadosamente as informações da conta ao transferir dinheiro para evitar erros de pagamento.
                            </p>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="font-bold">3.</span>
                            <p className="text-sm text-muted-foreground">
                                Cada encomenda corresponde a uma informação de pagamento. Não salve informações de pagamento anteriores para pagamento secundário.
                            </p>
                        </div>
                    </CardContent>
                </CardNoShadow>
            </div>
        </div>
    );
}

export default withAuth(Deposit);