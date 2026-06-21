import type { Notebook, NotebookCategory } from "./types";

export const NOTEBOOK_CATALOG: Notebook[] = [
  {
    id: "acer-aspire-go-15",
    name: "Acer Aspire Go 15",
    brand: "Acer",
    price: "R$ 2.499",
    priceValue: 2499,
    processor: "Intel Core i5-13420H",
    ram: "16GB DDR4",
    storage: "512GB SSD",
    gpu: "Intel UHD Graphics",
    screen: '15.6" Full HD',
    description:
      "Excelente custo-benefício para uso diário, estudos e trabalho",
    reason:
      "Perfeito para navegação, streaming de vídeos, pacote Office e estudos. 16GB de RAM garante multitarefa sem travamentos.",
    categories: ["basic", "student"],
  },
  {
    id: "lenovo-ideapad-slim-3",
    name: "Lenovo IdeaPad Slim 3",
    brand: "Lenovo",
    price: "R$ 3.299",
    priceValue: 3299,
    processor: "AMD Ryzen 7 7735HS",
    ram: "16GB DDR4",
    storage: "512GB SSD",
    gpu: "AMD Radeon Graphics",
    screen: '15.6" Full HD',
    description: "Notebook versátil e rápido para tarefas do dia a dia",
    reason:
      "Processador Ryzen 7 oferece excelente performance para uso geral. Ideal para estudantes e profissionais que precisam de um notebook confiável.",
    categories: ["basic", "student"],
  },
  {
    id: "samsung-galaxy-book4",
    name: "Samsung Galaxy Book4",
    brand: "Samsung",
    price: "R$ 4.799",
    priceValue: 4799,
    processor: "Intel Core 7 150U",
    ram: "16GB LPDDR4X",
    storage: "512GB SSD",
    gpu: "Intel Graphics",
    screen: '15.6" Full HD',
    description: "Ultrafino para produtividade e estudos avançados",
    reason:
      "Boa escolha para quem quer mobilidade, desempenho consistente e integração com ecossistema Samsung.",
    categories: ["basic", "student", "programming"],
  },
  {
    id: "asus-vivobook-16",
    name: "Asus Vivobook 16",
    brand: "Asus",
    price: "R$ 5.699",
    priceValue: 5699,
    processor: "AMD Ryzen 7 8845HS",
    ram: "16GB DDR5",
    storage: "1TB SSD",
    gpu: "Radeon 780M",
    screen: '16" WUXGA',
    description:
      "Modelo equilibrado para produtividade, programação e multitarefa intensa",
    reason:
      "Entrega desempenho forte para estudos, trabalho técnico e uso profissional sem entrar na faixa premium.",
    categories: ["student", "programming", "basic"],
  },
  {
    id: "lenovo-loq-15",
    name: "Lenovo LOQ 15",
    brand: "Lenovo",
    price: "R$ 5.999",
    priceValue: 5999,
    processor: "Intel Core i7-13620H",
    ram: "16GB DDR5",
    storage: "512GB SSD",
    gpu: "NVIDIA RTX 4050",
    screen: '15.6" Full HD 144Hz',
    description: "Entrada gamer com GPU dedicada e bom equilíbrio geral",
    reason:
      "Boa porta de entrada para games e softwares gráficos com orçamento intermediário.",
    categories: ["gaming", "engineering", "design"],
  },
  {
    id: "lenovo-legion-5-pro",
    name: "Lenovo Legion 5 Pro",
    brand: "Lenovo",
    price: "R$ 7.499",
    priceValue: 7499,
    processor: "AMD Ryzen 7 7735HS",
    ram: "16GB DDR5",
    storage: "512GB SSD",
    gpu: "NVIDIA RTX 4060",
    screen: '16" WQXGA 165Hz',
    description:
      "Excelente custo-benefício para gamers com display de alta taxa de atualização",
    reason:
      "Ótimo equilíbrio entre preço e performance. Roda Fortnite e Valorant em configurações altas com mais de 144 FPS.",
    categories: ["gaming"],
  },
  {
    id: "macbook-air-m4",
    name: "MacBook Air M4",
    brand: "Apple",
    price: "R$ 9.999",
    priceValue: 9999,
    processor: "Apple M4 (10 núcleos)",
    ram: "16GB Unified Memory",
    storage: "512GB SSD",
    gpu: "GPU integrada 10 núcleos",
    screen: '15.3" Liquid Retina',
    description:
      "Ultraleve e silencioso, perfeito para desenvolvimento com até 18h de bateria",
    reason:
      "Excelente para desenvolvimento. Compila código rapidamente, roda Docker e tem bateria para o dia inteiro.",
    categories: ["programming"],
  },
  {
    id: "lenovo-thinkpad-x9-15",
    name: "Lenovo ThinkPad X9 15",
    brand: "Lenovo",
    price: "R$ 8.499",
    priceValue: 8499,
    processor: "Intel Core Ultra 7 256V",
    ram: "32GB LPDDR5X",
    storage: "1TB SSD",
    gpu: "Intel Arc Graphics",
    screen: '15" OLED 2.8K',
    description:
      "Ultraportátil com teclado excepcional e longa duração de bateria",
    reason:
      "Teclado excelente para longas sessões de código e 32GB de RAM para múltiplas VMs e containers.",
    categories: ["programming"],
  },
  {
    id: "alienware-m16-r2",
    name: "Alienware m16 R2",
    brand: "Alienware",
    price: "R$ 12.999",
    priceValue: 12999,
    processor: "Intel Core i9-13900HX",
    ram: "32GB DDR5",
    storage: "1TB SSD NVMe",
    gpu: "NVIDIA RTX 4080",
    screen: '16" QHD+ 240Hz',
    description:
      "Notebook gamer de alta performance com refrigeração avançada e teclado RGB customizável",
    reason:
      "Perfeito para jogos modernos em configurações ultra. A RTX 4080 garante mais de 100 FPS em Fortnite.",
    categories: ["gaming"],
  },
  {
    id: "macbook-pro-16-m4-pro",
    name: 'MacBook Pro 16" M4 Pro',
    brand: "Apple",
    price: "R$ 19.999",
    priceValue: 19999,
    processor: "Apple M4 Pro (14 núcleos)",
    ram: "32GB Unified Memory",
    storage: "1TB SSD",
    gpu: "GPU integrada 20 núcleos",
    screen: '16.2" Liquid Retina XDR',
    description:
      "Melhor notebook para design com tela de alta precisão de cores e performance excepcional",
    reason:
      "A tela oferece ampla fidelidade de cores, ideal para trabalho profissional com imagem e vídeo.",
    categories: ["design"],
  },
  {
    id: "asus-proart-p16",
    name: "Asus ProArt P16",
    brand: "Asus",
    price: "R$ 14.999",
    priceValue: 14999,
    processor: "AMD Ryzen AI 9 HX 370",
    ram: "32GB DDR5",
    storage: "1TB SSD",
    gpu: "NVIDIA RTX 5090",
    screen: '16" 4K OLED',
    description:
      "Notebook profissional para criadores com certificação Pantone e GPU potente",
    reason:
      "Display OLED 4K e GPU potente para renderizações e efeitos pesados.",
    categories: ["design"],
  },
  {
    id: "lenovo-thinkpad-p1-gen-7",
    name: "Lenovo ThinkPad P1 Gen 7",
    brand: "Lenovo",
    price: "R$ 16.499",
    priceValue: 16499,
    processor: "Intel Core i9-14900HX",
    ram: "64GB DDR5",
    storage: "2TB SSD",
    gpu: "NVIDIA RTX 4070",
    screen: '16" WQUXGA',
    description:
      "Workstation mobile certificada para aplicações de engenharia e CAD",
    reason:
      "Indicada para AutoCAD, SolidWorks e simulações com projetos complexos.",
    categories: ["engineering"],
  },
  {
    id: "dell-precision-5690",
    name: "Dell Precision 5690",
    brand: "Dell",
    price: "R$ 18.999",
    priceValue: 18999,
    processor: "Intel Core Ultra 9 185H",
    ram: "32GB DDR5",
    storage: "1TB SSD",
    gpu: "NVIDIA RTX 3500 Ada",
    screen: '16" UHD+',
    description:
      "Workstation premium com certificações ISV para software de engenharia",
    reason:
      "Certificado para AutoCAD, ANSYS e MATLAB com foco em desempenho profissional.",
    categories: ["engineering"],
  },
];

export const BRANDS = [
  "Dell",
  "Lenovo",
  "HP",
  "Acer",
  "Asus",
  "Apple",
  "MSI",
  "Alienware",
  "Samsung",
] as const;

export const GIFT_ACCESSORIES = [
  "Mouse",
  "Teclado",
  "Fone",
  "Suporte para notebook",
  "Cadeira gamer",
] as const;

interface CategoryProfile {
  label: string;
  idealFor: string;
  watchOut: string;
}

export const CATEGORY_PROFILE: Record<NotebookCategory, CategoryProfile> = {
  gaming: {
    label: "Jogos",
    idealFor: "jogos, streaming e tarefas que exigem GPU dedicada",
    watchOut: "portabilidade máxima e longa autonomia de bateria",
  },
  design: {
    label: "Design e edição",
    idealFor: "edição de imagem e vídeo, ilustração e trabalho criativo",
    watchOut: "orçamentos muito baixos — exige mais investimento em GPU e tela",
  },
  engineering: {
    label: "Engenharia",
    idealFor: "CAD, simulação e softwares técnicos pesados",
    watchOut: "quem prioriza leveza e bateria acima de desempenho bruto",
  },
  programming: {
    label: "Programação",
    idealFor: "desenvolvimento, multitarefa e ambientes de virtualização",
    watchOut: "jogos pesados ou edição 3D intensiva",
  },
  student: {
    label: "Estudos",
    idealFor: "estudos, pesquisa, Office e multitarefa do dia a dia",
    watchOut: "jogos AAA e cargas gráficas pesadas",
  },
  basic: {
    label: "Uso geral",
    idealFor: "navegação, streaming, Office e estudos leves",
    watchOut: "jogos pesados, edição 3D ou renderização profissional",
  },
};

const CATEGORY_PRIORITY: NotebookCategory[] = [
  "gaming",
  "design",
  "engineering",
  "programming",
  "student",
  "basic",
];

export function getPrimaryCategory(
  categories: NotebookCategory[]
): NotebookCategory {
  return (
    CATEGORY_PRIORITY.find((category) => categories.includes(category)) ??
    "basic"
  );
}

export function getNotebookProfile(notebook: Notebook): CategoryProfile {
  return CATEGORY_PROFILE[getPrimaryCategory(notebook.categories)];
}
