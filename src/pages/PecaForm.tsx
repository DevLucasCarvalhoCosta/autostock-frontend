import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/auth/AuthContext"

interface Peca {
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

export default function PecaForm() {
  const { register, handleSubmit, setValue } = useForm<Peca>()
  const { token } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()

  const onSubmit = async (data: Peca) => {
    const url = id
      ? `http://localhost:8080/api/pecas/${id}`
      : "http://localhost:8080/api/pecas"

    const method = id ? "PUT" : "POST"

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data),
    })

    navigate("/")
  }

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8080/api/pecas`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then((pecas) => {
          const peca = pecas.find((p: any) => p.id === Number(id))
          if (peca) {
            Object.keys(peca).forEach((key) => {
              setValue(key as keyof Peca, peca[key])
            })
          }
        })
    }
  }, [id, setValue, token])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-bold text-blue-700">{id ? "Editar Peça" : "Cadastrar Nova Peça"}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Nome</Label>
          <Input {...register("nome")} />
        </div>

        <div>
          <Label>Classificação</Label>
          <Select onValueChange={(value) => setValue("classificacao", value)} defaultValue="NOVO">
            <SelectTrigger>
              <SelectValue placeholder="Selecionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NOVO">Novo</SelectItem>
              <SelectItem value="USADO">Usado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Quantidade</Label>
          <Input type="number" {...register("quantidade")} />
        </div>

        <div>
          <Label>Preço Unitário</Label>
          <Input type="number" step="0.01" {...register("precoUnitario")} />
        </div>

        <div>
          <Label>Fabricante</Label>
          <Input {...register("fabricante")} />
        </div>

        <div>
          <Label>Modelo do Carro</Label>
          <Input {...register("modeloCarro")} />
        </div>

        <div>
          <Label>Ano do Modelo</Label>
          <Input type="number" {...register("anoModelo")} />
        </div>

        <div>
          <Label>OEM</Label>
          <Input {...register("oem")} />
        </div>

        <div>
          <Label>Código Universal</Label>
          <Input {...register("codigoUniversal")} />
        </div>

        <div>
          <Label>Localização</Label>
          <Input {...register("localizacao")} />
        </div>
      </div>

      <div>
        <Label>Descrição</Label>
        <Textarea {...register("descricao")} />
      </div>

      <div className="text-right">
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          {id ? "Atualizar" : "Cadastrar"}
        </Button>
      </div>
    </form>
  )
}
