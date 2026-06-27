import type { ComparedNotebook, Notebook } from "@/lib/types";

/** Build a fully-formed Notebook, overriding only the fields a test cares about. */
export function makeNotebook(overrides: Partial<Notebook> = {}): Notebook {
  return {
    id: "nb-1",
    name: "Test Notebook",
    brand: "Lenovo",
    price: "R$ 5.000",
    priceValue: 5000,
    processor: "Intel Core i7",
    ram: "16GB DDR5",
    storage: "512GB SSD",
    gpu: "NVIDIA RTX 4060",
    screen: '15.6" Full HD',
    description: "Um notebook de teste",
    reason: "Boa relação custo-benefício para o seu perfil",
    categories: ["gaming"],
    ...overrides,
  };
}

export function makeCompared(
  index: number,
  overrides: Partial<Notebook> = {}
): ComparedNotebook {
  return { ...makeNotebook({ id: `nb-${index}`, ...overrides }), index };
}
