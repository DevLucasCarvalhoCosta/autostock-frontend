import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/auth/AuthContext"

interface Peca {
  id?: number
  nome: string
  descricao: string
  classificacao: string
  quantidade: number
  precoUnitario: number
  fabricante: string
  modeloCarro: string
  anoModelo: number
  oem: string
  codigoUniversal: string
  localizacao: string
}

export default function PecaList() {
  const [pecas, setPecas] = useState<Peca[]>([])
  const [pecaSelecionada, setPecaSelecionada] = useState<Peca | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [search, setSearch] = useState("")
  const navigate = useNavigate()
  const { token } = useAuth()

  useEffect(() => {
    if (!token) return

    fetch("http://localhost:8080/api/pecas", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setPecas(data))
      .catch((error) => console.error("Erro ao buscar peças:", error))
  }, [token])

  const filtrarPecas = () => {
    return pecas.filter(p =>
      p.nome.toLowerCase().includes(search.toLowerCase()) ||
      p.modeloCarro.toLowerCase().includes(search.toLowerCase()) ||
      p.oem.toLowerCase().includes(search.toLowerCase()) ||
      p.codigoUniversal.toLowerCase().includes(search.toLowerCase())
    )
  }

  const excluirPeca = (id: number) => {
    fetch(`http://localhost:8080/api/pecas/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setPecas(prev => prev.filter(p => p.id !== id))
        setConfirmDeleteId(null)
      })
      .catch((err) => console.error("Erro ao excluir peça:", err))
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-700">Peças Cadastradas</h1>
        <Button onClick={() => navigate("/cadastrar")} className="bg-blue-600 hover:bg-blue-700 text-white">
          Cadastrar Nova Peça
        </Button>
      </div>

      <Input
        placeholder="Pesquisar por nome, modelo, OEM ou código universal..."
        className="mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left font-medium">Nome</th>
              <th className="p-3 text-left font-medium">Modelo</th>
              <th className="p-3 text-left font-medium">OEM</th>
              <th className="p-3 text-left font-medium">Qtd</th>
              <th className="p-3 text-left font-medium">Preço</th>
              <th className="p-3 text-left font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtrarPecas().map((peca) => (
              <tr key={peca.id} className="hover:bg-gray-50">
                <td className="p-3">{peca.nome}</td>
                <td className="p-3">{peca.modeloCarro} ({peca.anoModelo})</td>
                <td className="p-3">{peca.oem}</td>
                <td className="p-3">{peca.quantidade}</td>
                <td className="p-3">R$ {peca.precoUnitario.toFixed(2)}</td>
                <td className="p-3 flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => setPecaSelecionada(peca)}>
                        Detalhes
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogTitle>Detalhes da Peça</DialogTitle>
                      <DialogDescription>Informações completas sobre a peça selecionada</DialogDescription>
                      <div className="space-y-1 text-sm">
                        <p><strong>Nome:</strong> {pecaSelecionada?.nome}</p>
                        <p><strong>Descrição:</strong> {pecaSelecionada?.descricao}</p>
                        <p><strong>Classificação:</strong> {pecaSelecionada?.classificacao}</p>
                        <p><strong>Fabricante:</strong> {pecaSelecionada?.fabricante}</p>
                        <p><strong>Modelo:</strong> {pecaSelecionada?.modeloCarro} ({pecaSelecionada?.anoModelo})</p>
                        <p><strong>OEM:</strong> {pecaSelecionada?.oem}</p>
                        <p><strong>Código Universal:</strong> {pecaSelecionada?.codigoUniversal}</p>
                        <p><strong>Localização:</strong> {pecaSelecionada?.localizacao}</p>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/editar/${peca.id}`)}
                  >
                    Alterar
                  </Button>

                  <Dialog open={confirmDeleteId === peca.id} onOpenChange={() => setConfirmDeleteId(null)}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setConfirmDeleteId(peca.id!)}
                      >
                        Excluir
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Confirmar exclusão</DialogTitle>
                      <DialogDescription>Essa ação é irreversível.</DialogDescription>
                      <p>Tem certeza que deseja excluir a peça <strong>{peca.nome}</strong>?</p>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="ghost" onClick={() => setConfirmDeleteId(null)}>
                          Cancelar
                        </Button>
                        <Button variant="destructive" onClick={() => excluirPeca(peca.id!)}>
                          Confirmar
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
