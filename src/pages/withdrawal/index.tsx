import { ArrowLeft, DollarSign } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent, CardDescription, CardNoShadow, CardTitle } from "@/components/ui/card";
import { Oswald } from "next/font/google";
import { useState } from "react";
import { withAuth } from '@/components/auth/protected-route';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast, Toaster } from 'react-hot-toast';

const oswald = Oswald({
    weight: "700",  
    subsets: ["latin"],
});

interface WithdrawResponse {
    externalRef: string;
    status: string;
}

function Withdrawal() {
    const [amount, setAmount] = useState<string>('');
    const [pixKey, setPixKey] = useState<string>('');
    const [pixKeyType, setPixKeyType] = useState<string>('');
    const [error, setError] = useState<string>('');

    // Função para formatar valor em reais
    const formatCurrency = (value: string) => {
        value = value.replace(/\D/g, "");
        value = (parseInt(value) / 100).toFixed(2);
        value = value.replace(".", ",");
        value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        return `R$ ${value}`;
    };

    // Função para formatar CPF
    const formatCPF = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    };

    // Função para formatar telefone
    const formatPhone = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
    };

    // Função para validar email
    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    // Função para formatar a chave PIX baseada no tipo
    const formatPixKey = (value: string, type: string) => {
        switch (type) {
            case 'cpf':
                return formatCPF(value);
            case 'phone':
                return formatPhone(value);
            case 'email':
                return value;
            default:
                return value;
        }
    };

    // Função para validar a chave PIX
    const validatePixKey = (value: string, type: string) => {
        switch (type) {
            case 'cpf':
                return value.replace(/\D/g, '').length === 11;
            case 'phone':
                return value.replace(/\D/g, '').length === 11;
            case 'email':
                return validateEmail(value);
            default:
                return false;
        }
    };

    const handlePixKeyChange = (value: string) => {
        const formattedValue = formatPixKey(value, pixKeyType);
        setPixKey(formattedValue);
    };

    const handleAmountChange = (value: string) => {
        value = value.replace(/\D/g, "");
        if (value) {
            setAmount(formatCurrency(value));
        } else {
            setAmount('');
        }
    };

    const handleSubmitPreSave = async () => {
        window.location.href = '/realease';
    }

    const handleSubmit = async () => {
        try {
            setError('');
            
            // Validações
            if (!amount) {
                toast.error('Informe o valor do saque');
                return;
            }

            if (!pixKey || !pixKeyType) {
                toast.error('Informe a chave PIX e o tipo');
                return;
            }

            if (!validatePixKey(pixKey, pixKeyType)) {
                toast.error('Chave PIX inválida');
                return;
            }

            const amountInCents = parseInt(amount.replace(/\D/g, ""));
            if (amountInCents < 2000) {
                toast.error('Valor mínimo de saque é R$ 20,00');
                return;
            }

            const userId = localStorage.getItem('id');
            if (!userId) {
                toast.error('Usuário não autenticado');
                return;
            }

            // Mostra loading durante a requisição
            const loadingToast = toast.loading('Processando saque...');

            const response = await fetch('https://api.epiroc.lat/api/gateway/withdraw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: amountInCents,
                    userId: parseInt(userId),
                    pixKeyType,
                    pixKey: pixKey.replace(/\D/g, '')
                })
            });

            const data = await response.json();

            // Remove o toast de loading
            toast.dismiss(loadingToast);

            if (!response.ok) {
                toast.error(data.details || data.error || 'Erro ao processar saque');
                return;
            }

            if (data.status === "pending") {
                toast.success('Saque solicitado com sucesso!');
                // Aguarda um pouco para o usuário ver a mensagem de sucesso
                setTimeout(() => {
                    window.location.href = '/withdrawals';
                }, 1500);
            } else {
                toast.error('Erro ao processar saque. Tente novamente.');
            }

        } catch (error: any) {
            console.error('Erro:', error);
            toast.error(error.message || 'Erro ao processar saque');
        }
    };

    return (
        <div className="m-4">
            {/* Adiciona o componente Toaster */}
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
                        Retirar
                    </p>
                </div>
            </div>

            <div className="mt-8">
                <div className="relative">
                    <DollarSign className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 transform -translate-y-1/2" />
                    <Input
                        type="text"
                        value={amount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        placeholder="Retirada mín. R$ 20,00"
                        className="text-start text-sm h-12 pl-12"
                    />
                </div>

                <div className="mt-4 space-y-4">
                    <Select onValueChange={setPixKeyType}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de chave PIX" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cpf">CPF</SelectItem>
                            <SelectItem value="email">E-mail</SelectItem>
                            <SelectItem value="phone">Telefone</SelectItem>
                        </SelectContent>
                    </Select>

                    <Input
                        type="text"
                        value={pixKey}
                        onChange={(e) => handlePixKeyChange(e.target.value)}
                        placeholder="Digite sua chave PIX"
                        className="text-start text-sm h-12"
                    />
                </div>

                <Button 
                    className="w-full mt-8 bg-brand h-12"
                    onClick={handleSubmitPreSave}
                >
                    Solicitar saque
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
                                O valor mínimo do saque é de R$ 20.
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
                                Para sua segurança nossos fundos estão protegidos em criptomoedas, todo e qualquer retirada esta sujeita a uma taxa de 3% sobre o valor da retirada e a analise de segurança.
                            </p>
                        </div>
                    </CardContent>
                </CardNoShadow>
            </div>
        </div>
    );
}

export default withAuth(Withdrawal);