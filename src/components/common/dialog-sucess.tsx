import { Dialog, DialogContent } from "../ui/dialog";
import Image from "next/image";

interface DialogSuccessProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'success' | 'error';
    operation: 'buy-plan' | 'withdrawal';
}

const operationMessages = {
    'buy-plan': {
        success: 'Plano adquirido com sucesso!',
        description: 'Aguarde os rendimentos começarem a ser creditados na sua carteira de investimentos toda 00h00.',
        error: 'Erro ao adquirir o plano',
        descriptionError: 'Ocorreu um erro ao adquirir o plano. Por favor, tente novamente.'
    },
    'withdrawal': {
        success: 'Saque realizado com sucesso!',
        description: 'O valor será creditado em breve na sua carteira de investimentos.',
        error: 'Erro ao realizar o saque',
        descriptionError: 'Ocorreu um erro ao realizar o saque. Por favor, tente novamente.'
    }
};

export default function DialogSuccess({ isOpen, onClose, type, operation }: DialogSuccessProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[320px] rounded-lg p-0 bg-white">
                <div className="flex flex-col items-center justify-center p-6 space-y-4">
                    <div className="w-16 h-16 relative">
                        <Image 
                            src={type === 'success' ? '/success.png' : '/error.png'} 
                            alt={type === 'success' ? 'Sucesso' : 'Erro'}
                            fill
                            className="object-contain"
                        />
                    </div>
                    <p className="text-center text-base font-medium">
                        {operationMessages[operation][type]}
                    </p>
                    <p className="text-center text-sm text-muted-foreground">
                        {type === 'success' ? operationMessages[operation].description : operationMessages[operation].descriptionError}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
