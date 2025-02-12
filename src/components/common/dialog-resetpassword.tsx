import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface DialogResetPasswordProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DialogResetPassword({ isOpen, onClose }: DialogResetPasswordProps) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            if (!newPassword || !confirmPassword) {
                toast.error('Preencha todos os campos');
                return;
            }

            if (newPassword !== confirmPassword) {
                toast.error('As senhas não coincidem');
                return;
            }

            if (!confirmed) {
                toast.error('Você precisa confirmar a troca de senha');
                return;
            }

            const userId = localStorage.getItem('id');
            if (!userId) {
                toast.error('Usuário não autenticado');
                return;
            }

            setLoading(true);

            const response = await fetch(`https://api.epiroc.lat/api/user/update/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: newPassword,
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao atualizar senha');
            }

            toast.success('Senha atualizada com sucesso!');
            onClose();
            
        } catch (error: any) {
            toast.error(error.message || 'Erro ao atualizar senha');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[320px] rounded-lg bg-white">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        Alterar Senha
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 mt-4">
                    <Input
                        type="password"
                        placeholder="Nova senha"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <Input
                        type="password"
                        placeholder="Confirme a nova senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="confirm" 
                            checked={confirmed}
                            onCheckedChange={(checked) => setConfirmed(checked as boolean)}
                        />
                        <label 
                            htmlFor="confirm" 
                            className="text-sm text-muted-foreground"
                        >
                            Confirmo a troca de senha e entendo que precisarei do suporte para resetá-la novamente
                        </label>
                    </div>

                    <Button 
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-brand"
                    >
                        {loading ? 'Alterando...' : 'Alterar Senha'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
