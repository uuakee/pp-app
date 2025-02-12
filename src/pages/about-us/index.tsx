import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle } from "lucide-react";
import Image from "next/image";
export default function AboutUs() {
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
                        Sobre nós
                    </p>
                </div>
            </div>
            <div className="mt-8 mb-32">
                <h1 className="text-md font-bold">
                    Quem somos?
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                A Epiroc é sua parceira para equipamentos de mineração e construção. Com origem na área de negócio Mining and Rock Excavation Technique e na divisão Hydraulic Attachment Tools da Atlas Copco, a Epiroc foi criada para ser um aliado mais forte para você. Ao aproveitar a experiência e o desempenho comprovados de diversas pessoas e um novo e ousado ímpeto para tornar o que é bom ainda melhor!<br/><br/>

Acreditamos na colaboração próxima com clientes, parceiros de negócios, colegas e outras partes interessadas. Nossa cultura de trabalho é voltada para o serviço e orientada para a ação, com uma forte devoção aos clientes.
                </p>
                <Image className="mt-4 rounded-lg" src="https://epiroc.scene7.com/is/image/epiroc/Epiroc_B9391050-1?$landscape1600$&cropN=0.00,0.03,1.00,0.68" alt="About Us" width={screen.width} height={screen.height} />
                <h1 className="text-md font-bold mt-4">
                    Segurança & transparência
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                Nosso compromisso é com a transparência, segurança e eficiência, garantindo que cada investidor tenha acesso a informações detalhadas e suporte contínuo. Contamos com um time de especialistas do mercado, sempre prontos para oferecer a melhor experiência de investimento.                </p>
            <div className="mt-8">
                <div>
                    <h1 className="text-md font-bold text-center">
                        Conheça mais sobre a Epiroc
                    </h1>
                    <Button className="w-full bg-brand mt-2">
                        <a href="https://t.me/epirocglobal" className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            Conheça mais sobre a Epiroc no Canal Oficial
                        </a>
                    </Button>
                </div>
            </div>
            </div>
        </div>
    );
}