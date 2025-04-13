import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNavigate } from "react-router-dom"

export default function PecaForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    classificacao: "NOVA",
    quantidade: "",
    precoUnitario: "",
    fabricante: "",
    modeloCarro: "",
    anoModelo: "",
    oem: "",
    codigoUniversal: "",
    localizacao: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (value: string) => {
    setForm({ ...form, classificacao: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const response = await fetch("http://localhost:8080/api/pecas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        quantidade: Number(form.quantidade),
        precoUnitario: Number(form.precoUnitario),
        anoModelo: Number(form.anoModelo)
      })
    })

    if (response.ok) {
      alert("Peça cadastrada com sucesso!")
      navigate("/")
    } else {
      alert("Erro ao cadastrar peça")
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Cadastrar Peça</h1>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="nome">Nome</Label>
          <Input id="nome" name="nome" value={form.nome} onChange={handleChange} required />
        </div>

        <div>
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea id="descricao" name="descricao" value={form.descricao} onChange={handleChange} />
        </div>

        <div>
          <Label>Classificação</Label>
          <Select onValueChange={handleSelectChange} defaultValue="NOVA">
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NOVA">NOVA</SelectItem>
              <SelectItem value="USADA">USADA</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="quantidade">Quantidade</Label>
            <Input id="quantidade" name="quantidade" type="number" value={form.quantidade} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="precoUnitario">Preço Unitário</Label>
            <Input id="precoUnitario" name="precoUnitario" type="number" step="0.01" value={form.precoUnitario} onChange={handleChange} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fabricante">Fabricante</Label>
            <Input id="fabricante" name="fabricante" value={form.fabricante} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="modeloCarro">Modelo do Carro</Label>
            <Input id="modeloCarro" name="modeloCarro" value={form.modeloCarro} onChange={handleChange} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="anoModelo">Ano Modelo</Label>
            <Input id="anoModelo" name="anoModelo" type="number" value={form.anoModelo} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="oem">OEM</Label>
            <Input id="oem" name="oem" value={form.oem} onChange={handleChange} />
          </div>
        </div>

        <div>
          <Label htmlFor="codigoUniversal">Código Universal</Label>
          <Input id="codigoUniversal" name="codigoUniversal" value={form.codigoUniversal} onChange={handleChange} />
        </div>

        <div>
          <Label htmlFor="localizacao">Localização no Estoque</Label>
          <Input id="localizacao" name="localizacao" value={form.localizacao} onChange={handleChange} />
        </div>

        <Button type="submit" className="mt-4">Salvar Peça</Button>
      </form>
    </div>
  )
}
