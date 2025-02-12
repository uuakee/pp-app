import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputMask } from '@react-input/mask';
import { Phone, Lock } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || !password) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    try {
      setLoading(true);
      
      const cleanPhone = phone.replace(/\D/g, "");
      const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone.slice(2) : cleanPhone;

      const response = await fetch(`https://api.epiroc.lat/api/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formattedPhone,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Credenciais inválidas');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('id', data.id);
        toast.success('Login realizado com sucesso!');
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      }

    } catch (error: any) {
      toast.error(error.message || "Ocorreu um erro ao fazer login.");
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
      <Toaster position="top-center" />
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
            Faça login na sua conta de investimentos com seu número e senha
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
              <Button 
                type="submit" 
                className="w-full bg-brand hover:bg-brand/90"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center mt-6">
            <p className="text-muted-foreground text-sm">
              Não tem uma conta? <a className="underline hover:text-brand" href="/auth/register">Cadastre-se</a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
