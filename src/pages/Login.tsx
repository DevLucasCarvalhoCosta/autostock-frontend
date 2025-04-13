import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/auth/AuthContext"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function Login() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro("")

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      })

      if (!response.ok) {
        throw new Error("Credenciais inválidas")
      }

      const token = await response.text()
      login(token)
      navigate("/") // Redireciona para home
    } catch (err) {
      setErro((err as Error).message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 shadow">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Login AutoStock</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            {erro && <p className="text-red-500 text-sm">{erro}</p>}

            <Button type="submit" className="w-full">Entrar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
