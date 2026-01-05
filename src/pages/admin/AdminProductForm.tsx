import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Package, Plus, Trash2, Loader2, ImagePlus, GripVertical } from "lucide-react";
import { toast } from "sonner";
import {
  fetchAdminProduct,
  fetchAdminCategories,
  createAdminProduct,
  updateAdminProduct,
  AdminCategory,
} from "@/services/adminApi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ImageInput {
  id?: number;
  url: string;
  ordem: number;
  principal: boolean;
}

interface SpecInput {
  id?: number;
  label: string;
  valor: string;
}

interface VariationInput {
  id?: number;
  cor: string;
  cor_codigo: string;
  capacidade: string;
  estoque: number;
  preco: string;
}

// Lista de modelos de iPhone
const IPHONE_MODELS = [
  "IPHONE 6", "IPHONE 6 PLUS", "IPHONE 6S", "IPHONE 6S PLUS",
  "IPHONE 7", "IPHONE 7 PLUS", "IPHONE 8", "IPHONE 8 PLUS",
  "IPHONE X", "IPHONE XR", "IPHONE XS", "IPHONE XS MAX",
  "IPHONE 11", "IPHONE 11 PRO", "IPHONE 11 PRO MAX",
  "IPHONE 12", "IPHONE 12 MINI", "IPHONE 12 PRO", "IPHONE 12 PRO MAX",
  "IPHONE 13", "IPHONE 13 MINI", "IPHONE 13 PRO", "IPHONE 13 PRO MAX",
  "IPHONE 14", "IPHONE 14 PLUS", "IPHONE 14 PRO", "IPHONE 14 PRO MAX",
  "IPHONE 15", "IPHONE 15 PLUS", "IPHONE 15 PRO", "IPHONE 15 PRO MAX",
  "IPHONE 16", "IPHONE 16 PLUS", "IPHONE 16 PRO", "IPHONE 16 PRO MAX",
  "IPHONE SE 2020", "IPHONE SE 2022", "OUTROS"
];

// Lista de condições
const CONDITIONS = [
  { value: "novo", label: "Novo" },
  { value: "seminovo", label: "Seminovo" },
  { value: "usado_excelente", label: "Usado - Excelente" },
  { value: "usado_bom", label: "Usado - Bom" },
  { value: "recondicionado", label: "Recondicionado" },
  { value: "com_defeito", label: "Com defeito" }
];

// Lista de capacidades
const CAPACITIES = [
  "64GB", "128GB", "256GB", "512GB", "1TB"
];

// Lista de cores com códigos hex
const COLORS: { name: string; code: string }[] = [
  { name: "Amarelo", code: "#FFD700" },
  { name: "Azul", code: "#007AFF" },
  { name: "Branco", code: "#FFFFFF" },
  { name: "Bronze", code: "#CD7F32" },
  { name: "Cinza", code: "#808080" },
  { name: "Dourado", code: "#DAA520" },
  { name: "Laranja", code: "#FF9500" },
  { name: "Prata", code: "#C0C0C0" },
  { name: "Preto", code: "#1C1C1E" },
  { name: "Rosa", code: "#FF2D55" },
  { name: "Roxo", code: "#AF52DE" },
  { name: "Verde", code: "#34C759" },
  { name: "Vermelho", code: "#FF3B30" },
  { name: "Titânio Natural", code: "#D4D4D4" },
  { name: "Titânio Azul", code: "#5A6E7F" },
  { name: "Titânio Preto", code: "#1C1C1C" },
  { name: "Titânio Branco", code: "#F5F5F5" },
];

// Lista de telas por modelo
const DISPLAY_SPECS: Record<string, string> = {
  "IPHONE 6": "4.7\" Retina HD",
  "IPHONE 6 PLUS": "5.5\" Retina HD",
  "IPHONE 6S": "4.7\" Retina HD",
  "IPHONE 6S PLUS": "5.5\" Retina HD",
  "IPHONE 7": "4.7\" Retina HD",
  "IPHONE 7 PLUS": "5.5\" Retina HD",
  "IPHONE 8": "4.7\" Retina HD",
  "IPHONE 8 PLUS": "5.5\" Retina HD",
  "IPHONE X": "5.8\" Super Retina HD",
  "IPHONE XR": "6.1\" Liquid Retina HD",
  "IPHONE XS": "5.8\" Super Retina HD",
  "IPHONE XS MAX": "6.5\" Super Retina HD",
  "IPHONE 11": "6.1\" Liquid Retina HD",
  "IPHONE 11 PRO": "5.8\" Super Retina XDR",
  "IPHONE 11 PRO MAX": "6.5\" Super Retina XDR",
  "IPHONE 12": "6.1\" Super Retina XDR",
  "IPHONE 12 MINI": "5.4\" Super Retina XDR",
  "IPHONE 12 PRO": "6.1\" Super Retina XDR",
  "IPHONE 12 PRO MAX": "6.7\" Super Retina XDR",
  "IPHONE 13": "6.1\" Super Retina XDR",
  "IPHONE 13 MINI": "5.4\" Super Retina XDR",
  "IPHONE 13 PRO": "6.1\" Super Retina XDR ProMotion",
  "IPHONE 13 PRO MAX": "6.7\" Super Retina XDR ProMotion",
  "IPHONE 14": "6.1\" Super Retina XDR",
  "IPHONE 14 PLUS": "6.7\" Super Retina XDR",
  "IPHONE 14 PRO": "6.1\" Super Retina XDR ProMotion",
  "IPHONE 14 PRO MAX": "6.7\" Super Retina XDR ProMotion",
  "IPHONE 15": "6.1\" Super Retina XDR",
  "IPHONE 15 PLUS": "6.7\" Super Retina XDR",
  "IPHONE 15 PRO": "6.1\" Super Retina XDR ProMotion",
  "IPHONE 15 PRO MAX": "6.7\" Super Retina XDR ProMotion",
  "IPHONE 16": "6.1\" Super Retina XDR",
  "IPHONE 16 PLUS": "6.7\" Super Retina XDR",
  "IPHONE 16 PRO": "6.3\" Super Retina XDR ProMotion",
  "IPHONE 16 PRO MAX": "6.9\" Super Retina XDR ProMotion",
  "IPHONE SE 2020": "4.7\" Retina HD",
  "IPHONE SE 2022": "4.7\" Retina HD",
};

// Lista de câmeras por modelo
const CAMERA_SPECS: Record<string, string> = {
  "IPHONE 6": "8MP",
  "IPHONE 6 PLUS": "8MP",
  "IPHONE 6S": "12MP",
  "IPHONE 6S PLUS": "12MP",
  "IPHONE 7": "12MP",
  "IPHONE 7 PLUS": "12MP + 12MP",
  "IPHONE 8": "12MP",
  "IPHONE 8 PLUS": "12MP + 12MP",
  "IPHONE X": "12MP + 12MP",
  "IPHONE XR": "12MP",
  "IPHONE XS": "12MP + 12MP",
  "IPHONE XS MAX": "12MP + 12MP",
  "IPHONE 11": "12MP + 12MP",
  "IPHONE 11 PRO": "12MP + 12MP + 12MP",
  "IPHONE 11 PRO MAX": "12MP + 12MP + 12MP",
  "IPHONE 12": "12MP + 12MP",
  "IPHONE 12 MINI": "12MP + 12MP",
  "IPHONE 12 PRO": "12MP + 12MP + 12MP + LiDAR",
  "IPHONE 12 PRO MAX": "12MP + 12MP + 12MP + LiDAR",
  "IPHONE 13": "12MP + 12MP",
  "IPHONE 13 MINI": "12MP + 12MP",
  "IPHONE 13 PRO": "12MP + 12MP + 12MP + LiDAR",
  "IPHONE 13 PRO MAX": "12MP + 12MP + 12MP + LiDAR",
  "IPHONE 14": "12MP + 12MP",
  "IPHONE 14 PLUS": "12MP + 12MP",
  "IPHONE 14 PRO": "48MP + 12MP + 12MP + LiDAR",
  "IPHONE 14 PRO MAX": "48MP + 12MP + 12MP + LiDAR",
  "IPHONE 15": "48MP + 12MP",
  "IPHONE 15 PLUS": "48MP + 12MP",
  "IPHONE 15 PRO": "48MP + 12MP + 12MP + LiDAR",
  "IPHONE 15 PRO MAX": "48MP + 12MP + 12MP + LiDAR",
  "IPHONE 16": "48MP + 12MP",
  "IPHONE 16 PLUS": "48MP + 12MP",
  "IPHONE 16 PRO": "48MP + 48MP + 12MP + LiDAR",
  "IPHONE 16 PRO MAX": "48MP + 48MP + 12MP + LiDAR",
  "IPHONE SE 2020": "12MP",
  "IPHONE SE 2022": "12MP",
};

const AdminProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id && id !== 'novo';

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  const [formData, setFormData] = useState({
    nome: "",
    sku: "",
    categoria_id: "",
    modelo: "",
    condicao: "",
    condicao_descricao: "",
    preco: "",
    preco_original: "",
    estoque: "",
    garantia_meses: "12",
    descricao: "",
    descricao_curta: "",
    tela: "",
    camera: "",
    chip: "",
    destaque: false,
    ativo: true,
  });

  const [images, setImages] = useState<ImageInput[]>([
    { url: "", ordem: 0, principal: true }
  ]);

  const [specs, setSpecs] = useState<SpecInput[]>([]);
  
  const [variations, setVariations] = useState<VariationInput[]>([]);

  // Carregar categorias
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchAdminCategories();
        setCategories(data);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        setCategories([
          { id: 1, nome: 'iPhones', slug: 'iphones', descricao: '', imagem: '', ordem: 1, ativo: true },
          { id: 2, nome: 'iPads', slug: 'ipads', descricao: '', imagem: '', ordem: 2, ativo: true },
          { id: 3, nome: 'Apple Watch', slug: 'apple-watch', descricao: '', imagem: '', ordem: 3, ativo: true },
          { id: 4, nome: 'MacBooks', slug: 'macbooks', descricao: '', imagem: '', ordem: 4, ativo: true },
          { id: 5, nome: 'Acessórios', slug: 'acessorios', descricao: '', imagem: '', ordem: 5, ativo: true },
        ]);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login", { replace: true });
    } else {
      setIsAuthenticated(true);
      if (isEditing) {
        loadProduct();
      }
    }
  }, [navigate, isEditing, id]);

  // Auto-preencher tela e câmera quando modelo muda
  useEffect(() => {
    if (formData.modelo && formData.modelo !== "OUTROS") {
      const display = DISPLAY_SPECS[formData.modelo] || "";
      const camera = CAMERA_SPECS[formData.modelo] || "";
      setFormData(prev => ({
        ...prev,
        tela: display,
        camera: camera
      }));
    }
  }, [formData.modelo]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const product = await fetchAdminProduct(Number(id));

      setFormData({
        nome: product.nome || "",
        sku: product.sku || "",
        categoria_id: String(product.categoria_id || ""),
        modelo: product.modelo || "",
        condicao: product.condicao || "",
        condicao_descricao: product.condicao_descricao || "",
        preco: String(product.preco || ""),
        preco_original: String(product.preco_original || ""),
        estoque: String(product.estoque || ""),
        garantia_meses: String(product.garantia_meses || "12"),
        descricao: product.descricao || "",
        descricao_curta: product.descricao_curta || "",
        tela: product.tela || "",
        camera: product.camera || "",
        chip: product.chip || "",
        destaque: product.destaque || false,
        ativo: product.ativo !== false,
      });

      if (product.imagens && product.imagens.length > 0) {
        setImages(product.imagens);
      }

      if (product.especificacoes && product.especificacoes.length > 0) {
        setSpecs(product.especificacoes);
      }

      if (product.variacoes && product.variacoes.length > 0) {
        setVariations(product.variacoes.map((v: any) => ({
          id: v.id,
          cor: v.cor || '',
          cor_codigo: v.cor_codigo || '',
          capacidade: v.capacidade || '',
          estoque: v.estoque || 0,
          preco: String(v.preco || '')
        })));
      }
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
      toast.error('Erro ao carregar produto');
      navigate('/admin/produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Gerenciamento de imagens
  const addImage = () => {
    setImages([...images, { url: "", ordem: images.length, principal: false }]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    if (images[index].principal && newImages.length > 0) {
      newImages[0].principal = true;
    }
    setImages(newImages);
  };

  const updateImage = (index: number, url: string) => {
    const newImages = [...images];
    newImages[index].url = url;
    setImages(newImages);
  };

  const setMainImage = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      principal: i === index,
    }));
    setImages(newImages);
  };

  // Gerenciamento de especificações
  const addSpec = () => {
    setSpecs([...specs, { label: "", valor: "" }]);
  };

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const updateSpec = (index: number, field: 'label' | 'valor', value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  // Gerenciamento de variações
  const addVariation = () => {
    setVariations([...variations, { cor: "", cor_codigo: "", capacidade: "", estoque: 0, preco: "" }]);
  };

  const removeVariation = (index: number) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  const updateVariation = (index: number, field: keyof VariationInput, value: string | number) => {
    const newVariations = [...variations];
    (newVariations[index] as any)[field] = value;
    
    // Auto-preencher código da cor
    if (field === 'cor') {
      const color = COLORS.find(c => c.name === value);
      if (color) {
        newVariations[index].cor_codigo = color.code;
      }
    }
    
    setVariations(newVariations);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.categoria_id || !formData.preco) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const validImages = images.filter(img => img.url.trim());
    if (validImages.length === 0) {
      toast.error("Adicione pelo menos uma imagem");
      return;
    }

    const validSpecs = specs.filter(s => s.label.trim() && s.valor.trim());
    
    // Adicionar specs automáticas de tela e câmera
    if (formData.tela && !validSpecs.find(s => s.label.toLowerCase() === 'tela')) {
      validSpecs.push({ label: 'Tela', valor: formData.tela });
    }
    if (formData.camera && !validSpecs.find(s => s.label.toLowerCase() === 'câmera')) {
      validSpecs.push({ label: 'Câmera', valor: formData.camera });
    }
    if (formData.chip && !validSpecs.find(s => s.label.toLowerCase() === 'chip')) {
      validSpecs.push({ label: 'Chip', valor: formData.chip });
    }

    const validVariations = variations.filter(v => v.cor || v.capacidade).map(v => ({
      ...v,
      preco: Number(v.preco) || 0,
      estoque: Number(v.estoque) || 0
    }));

    try {
      setSaving(true);

      const productData = {
        nome: formData.nome,
        sku: formData.sku,
        categoria_id: Number(formData.categoria_id),
        modelo: formData.modelo,
        condicao: formData.condicao,
        condicao_descricao: formData.condicao_descricao,
        preco: Number(formData.preco),
        preco_original: Number(formData.preco_original) || Number(formData.preco),
        estoque: Number(formData.estoque) || 0,
        garantia_meses: Number(formData.garantia_meses) || 12,
        descricao: formData.descricao,
        descricao_curta: formData.descricao_curta,
        tela: formData.tela,
        camera: formData.camera,
        chip: formData.chip,
        destaque: formData.destaque,
        ativo: formData.ativo,
        imagens: validImages.map((img) => img.url),
        especificacoes: validSpecs,
        variacoes: validVariations,
      };

      if (isEditing) {
        await updateAdminProduct(Number(id), productData);
        toast.success("Produto atualizado com sucesso!");
      } else {
        await createAdminProduct(productData);
        toast.success("Produto cadastrado com sucesso!");
      }
      
      navigate("/admin/produtos");
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error(isEditing ? "Erro ao atualizar produto" : "Erro ao cadastrar produto");
    } finally {
      setSaving(false);
    }
  };

  if (isAuthenticated === null || loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <Header />

      <div className="container py-8 flex-1">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/produtos">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
          {/* Dados Básicos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                {isEditing ? "Editar Produto" : "Cadastrar Novo Produto"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="nome">Nome do Produto *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleChange("nome", e.target.value)}
                    placeholder="Ex: iPhone 14 Pro Max 256GB"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleChange("sku", e.target.value)}
                    placeholder="Ex: IPH14PM-256-AZL"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria_id">Categoria *</Label>
                  <Select
                    value={formData.categoria_id}
                    onValueChange={(value) => handleChange("categoria_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modelo">Modelo</Label>
                  <Select
                    value={formData.modelo}
                    onValueChange={(value) => handleChange("modelo", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o modelo" />
                    </SelectTrigger>
                    <SelectContent className="bg-background max-h-60">
                      {IPHONE_MODELS.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condicao">Condição *</Label>
                  <Select
                    value={formData.condicao}
                    onValueChange={(value) => handleChange("condicao", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      {CONDITIONS.map((cond) => (
                        <SelectItem key={cond.value} value={cond.value}>
                          {cond.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="condicao_descricao">Descrição da Condição</Label>
                  <Input
                    id="condicao_descricao"
                    value={formData.condicao_descricao}
                    onChange={(e) => handleChange("condicao_descricao", e.target.value)}
                    placeholder="Ex: Bateria acima de 90%, sem marcas de uso"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preco">Preço de Venda (R$) *</Label>
                  <Input
                    id="preco"
                    type="number"
                    step="0.01"
                    value={formData.preco}
                    onChange={(e) => handleChange("preco", e.target.value)}
                    placeholder="0,00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preco_original">Preço Original (R$)</Label>
                  <Input
                    id="preco_original"
                    type="number"
                    step="0.01"
                    value={formData.preco_original}
                    onChange={(e) => handleChange("preco_original", e.target.value)}
                    placeholder="0,00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estoque">Estoque *</Label>
                  <Input
                    id="estoque"
                    type="number"
                    value={formData.estoque}
                    onChange={(e) => handleChange("estoque", e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="garantia_meses">Garantia (meses)</Label>
                  <Input
                    id="garantia_meses"
                    type="number"
                    value={formData.garantia_meses}
                    onChange={(e) => handleChange("garantia_meses", e.target.value)}
                    placeholder="12"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Especificações Técnicas */}
          <Card>
            <CardHeader>
              <CardTitle>Especificações Técnicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tela">Tela</Label>
                  <Input
                    id="tela"
                    value={formData.tela}
                    onChange={(e) => handleChange("tela", e.target.value)}
                    placeholder='Ex: 6.1" Super Retina XDR'
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="camera">Câmera</Label>
                  <Input
                    id="camera"
                    value={formData.camera}
                    onChange={(e) => handleChange("camera", e.target.value)}
                    placeholder="Ex: 48MP + 12MP + 12MP"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chip">Chip</Label>
                  <Input
                    id="chip"
                    value={formData.chip}
                    onChange={(e) => handleChange("chip", e.target.value)}
                    placeholder="Ex: A17 Pro"
                  />
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                * Tela e Câmera são preenchidos automaticamente ao selecionar o modelo do iPhone.
              </p>
            </CardContent>
          </Card>

          {/* Variações de Cor e Capacidade */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Variações (Cor/Capacidade)</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addVariation}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Variação
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {variations.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma variação adicionada. Clique em "Adicionar Variação" para incluir cores e capacidades diferentes.
                </p>
              ) : (
                variations.map((variation, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 border rounded-lg">
                    <div className="space-y-2">
                      <Label>Cor</Label>
                      <Select
                        value={variation.cor}
                        onValueChange={(value) => updateVariation(index, 'cor', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                          {COLORS.map((color) => (
                            <SelectItem key={color.name} value={color.name}>
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-4 h-4 rounded border border-border"
                                  style={{ backgroundColor: color.code }}
                                />
                                {color.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Capacidade</Label>
                      <Select
                        value={variation.capacidade}
                        onValueChange={(value) => updateVariation(index, 'capacidade', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                          {CAPACITIES.map((cap) => (
                            <SelectItem key={cap} value={cap}>
                              {cap}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Estoque</Label>
                      <Input
                        type="number"
                        value={variation.estoque}
                        onChange={(e) => updateVariation(index, 'estoque', Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Preço (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={variation.preco}
                        onChange={(e) => updateVariation(index, 'preco', e.target.value)}
                        placeholder="Usar preço base"
                      />
                    </div>

                    <div className="flex items-end">
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeVariation(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Descrições */}
          <Card>
            <CardHeader>
              <CardTitle>Descrições</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="descricao_curta">Descrição Curta</Label>
                <Input
                  id="descricao_curta"
                  value={formData.descricao_curta}
                  onChange={(e) => handleChange("descricao_curta", e.target.value)}
                  placeholder="Breve descrição do produto"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição Completa</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => handleChange("descricao", e.target.value)}
                  placeholder="Descreva o produto, estado de conservação, acessórios inclusos..."
                  rows={4}
                />
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    id="destaque"
                    checked={formData.destaque}
                    onCheckedChange={(checked) => handleChange("destaque", checked)}
                  />
                  <Label htmlFor="destaque">Produto em destaque</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="ativo"
                    checked={formData.ativo}
                    onCheckedChange={(checked) => handleChange("ativo", checked)}
                  />
                  <Label htmlFor="ativo">Produto ativo</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Imagens */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ImagePlus className="w-5 h-5" />
                Imagens
              </CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addImage}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Imagem
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {images.map((image, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <GripVertical className="w-5 h-5 text-muted-foreground mt-2 cursor-move" />
                  
                  {image.url && (
                    <img 
                      src={image.url} 
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  )}
                  
                  <div className="flex-1 space-y-2">
                    <Input
                      value={image.url}
                      onChange={(e) => updateImage(index, e.target.value)}
                      placeholder="Cole a URL da imagem"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="mainImage"
                        checked={image.principal}
                        onChange={() => setMainImage(index)}
                        id={`main-${index}`}
                      />
                      <Label htmlFor={`main-${index}`} className="text-sm text-muted-foreground">
                        Imagem principal
                      </Label>
                    </div>
                  </div>
                  
                  {images.length > 1 && (
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => removeImage(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              <p className="text-sm text-muted-foreground">
                Cole URLs de imagens do produto. A imagem marcada como principal aparecerá na listagem.
              </p>
            </CardContent>
          </Card>

          {/* Especificações Adicionais */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Especificações Adicionais</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addSpec}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {specs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma especificação adicional. Clique em "Adicionar" para incluir.
                </p>
              ) : (
                specs.map((spec, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Input
                      value={spec.label}
                      onChange={(e) => updateSpec(index, 'label', e.target.value)}
                      placeholder="Ex: Bateria"
                      className="flex-1"
                    />
                    <Input
                      value={spec.valor}
                      onChange={(e) => updateSpec(index, 'valor', e.target.value)}
                      placeholder="Ex: Saúde 95%"
                      className="flex-1"
                    />
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => removeSpec(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex gap-4">
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isEditing ? "Salvar Alterações" : "Cadastrar Produto"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link to="/admin/produtos">Cancelar</Link>
            </Button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default AdminProductForm;
