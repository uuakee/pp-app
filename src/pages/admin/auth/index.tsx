import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShieldX } from 'lucide-react'

export default function AdminLogin() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [credentials, setCredentials] = useState({
    phone: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Evita problemas de hidratação renderizando apenas no cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  const formatPhoneNumber = (phone: string) => {
    // Remove todos os caracteres não numéricos
    const numbersOnly = phone.replace(/\D/g, '')
    // Remove o prefixo 55 se existir
    return numbersOnly.startsWith('55') ? numbersOnly.slice(2) : numbersOnly
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const formattedPhone = formatPhoneNumber(credentials.phone)
      
      const response = await fetch('https://api.epiroc.lat/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formattedPhone,
          password: credentials.password
        }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.user.is_admin) {
          localStorage.setItem('token', data.token)
          localStorage.setItem('id', data.id)
          router.push('/admin/dashboard')
        } else {
          setError('Acesso negado. Você não tem permissões de administrador.')
        }
      } else {
        setError(data.message || 'Erro ao fazer login')
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor')
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return null // ou um loading placeholder
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Ponzify
          </CardTitle>
          <CardDescription className="text-center">
            Entre com suas credenciais de administrador
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={credentials.phone}
                onChange={(e) => setCredentials({
                  ...credentials,
                  phone: e.target.value
                })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({
                  ...credentials,
                  password: e.target.value
                })}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
