// src/pages/realease/index.tsx

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, DollarSign, ArrowDown, User, CircleHelp, ServerCog, Speech, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import dynamic from 'next/dynamic';
import approvalContractAnimation from "@/lib/jsons/approval-contract.json";

// Importação dinâmica do Lottie com SSR desabilitado
const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
  loading: () => <div className="w-full h-[400px] animate-pulse bg-gray-200 rounded-lg" />
});

export default function Release() {
  return (
    <div className="m-4">
        {/* Header */}
        <div className="flex justify-between items-center">
            <Image src="/logotype.svg" alt="Collapse Logo" width={120} height={40} />

            <div className="flex gap-4 items-center">
                <Badge variant="outline" className="bg-slate-500 text-white h-7">
                    <Calendar className="w-4 h-4 mr-2" />
                    Lançamento: 17/02/2025
                </Badge>
            </div>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center mt-28 md:mt-0 min-h-[calc(100vh-120px)]">
            <div className="w-full max-w-[600px] md:max-w-[400px] mx-auto">
                <Lottie 
                    animationData={approvalContractAnimation}
                    loop={true}
                    autoplay={true}
                    style={{ width: '70%', height: '80%' }}
                    className="mx-auto"
                    rendererSettings={{
                        preserveAspectRatio: 'xMidYMid slice'
                    }}
                />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-center">
                    Estamos ajustando tudo para um lançamento incrível!
                </h1>
                <p className="text-muted-foreground text-center mt-4">
                    Nosso time está trabalhando para trazer o melhor para você, 
                    em breve você poderá acessar o nosso sistema para desfrutar de todas os investimentos
                    desta internacionalização.
                </p>
                <Button className="w-full mt-4 bg-brand hover:bg-brand/90 font-bold" onClick={() => window.open('https://t.me/epirocglobal', '_blank')}>
                    <Speech className="w-4 h-4 mr-1" />
                    Canal Oficial do Telegram
                </Button>
            </div>
        </div>
    </div>
  )
}

