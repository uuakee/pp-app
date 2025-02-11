// src/pages/auth/register/index.tsx

import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputMask } from '@react-input/mask';
import { Phone, Lock, Gift } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { useToast } from "@/hooks/use-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Register() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [invitedBy, setInvitedBy] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();

  // Pegar o código de referência da URL
  useEffect(() => {
    // Pega o código da query
    const { r } = router.query;
    
    // Pega o código do path se existir
    const pathRef = router.asPath.split('r=')[1];
    
    if (r) {
      setInvitedBy(r as string);
    } else if (pathRef) {
      setInvitedBy(pathRef);
    }
  }, [router.query, router.asPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!phone || !password || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: "As senhas não coincidem.",
      });
      return;
    }

    // Remove caracteres não numéricos do telefone
    const cleanPhone = phone.replace(/\D/g, "");

    try {
      setLoading(true);
      
      // Monta o payload
      const payload: any = {
        phone: cleanPhone,
        password: password,
      };

      // Adiciona invited_by apenas se estiver preenchido
      if (invitedBy) {
        payload.invited_by = invitedBy;
      }

      const response = await fetch(`https://api.epiroc.lat/api/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao realizar cadastro');
      }

      toast({
        title: "Sucesso!",
        description: "Cadastro realizado com sucesso.",
      });

      // Redireciona para o login
      router.push('/');

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: error.message || "Ocorreu um erro ao realizar o cadastro.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className=""
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: "radial-gradient(#dddddd 1px, #ffffff 1px)",
        backgroundSize: "20px 20px"
      }}
    >
      <div className="flex items-center justify-center min-h-screen scroll-none">
        <Card className="p-6 w-[380px]">
          <CardTitle className="space-y-4">
            <Image
              src="/collapse_logo.svg"
              alt="logo"
              width={40}
              height={40}
              className="mx-auto"
            />
            <img
              src="/ponzi_banner2.gif"
              alt="banner"
              className="mx-auto w-[320px] h-[120px] rounded-lg"
            />
          </CardTitle>
          <CardDescription className="text-center mt-6 mb-6">
            Crie sua conta de investimentos preenchendo os dados abaixo
          </CardDescription>
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-brand" />
                <InputMask 
                  component={Input}
                  mask="+55 (__) _____-____"
                  replacement={{ _: /\d/ }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Número de celular"
                  className="pl-10 text-sm"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-brand" />
                <Input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-brand" />
                <Input
                  type="password"
                  placeholder="Confirmar senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
              <div className="relative">
                <Gift className="absolute left-3 top-2.5 h-4 w-4 text-brand" />
                <Input
                  type="text"
                  placeholder="Código de afiliação (opcional)"
                  value={invitedBy}
                  onChange={(e) => setInvitedBy(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-brand hover:bg-brand/90"
                disabled={loading}
              >
                {loading ? "Registrando..." : "Registrar"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center mt-6">
            <p className="text-muted-foreground text-sm">
              Já tem uma conta? <a className="underline hover:text-brand" href="/">Faça login</a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
