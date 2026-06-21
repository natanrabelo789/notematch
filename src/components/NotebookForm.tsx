"use client";

import { BRANDS, GIFT_ACCESSORIES } from "@/lib/catalog";
import type { BudgetRange, UserType } from "@/lib/types";
import { FormEvent, useState } from "react";

export interface FinderFormData {
  userType: UserType;
  giftRecipient: string;
  giftAccessories: string[];
  usage: string;
  brand: string;
  budgetRange: BudgetRange;
}

interface NotebookFormProps {
  onSubmit: (data: FinderFormData) => void;
  loading: boolean;
}

export default function NotebookForm({ onSubmit, loading }: NotebookFormProps) {
  const [userType, setUserType] = useState<UserType>("myself");
  const [giftRecipient, setGiftRecipient] = useState("");
  const [giftAccessories, setGiftAccessories] = useState<string[]>([]);
  const [usage, setUsage] = useState("");
  const [brand, setBrand] = useState("");
  const [budgetRange, setBudgetRange] = useState<BudgetRange>("ate-4000");

  const isGift = userType === "gift";

  function handleUserTypeChange(value: UserType) {
    setUserType(value);
    if (value !== "gift") {
      setGiftAccessories([]);
    }
  }

  function toggleAccessory(accessory: string) {
    setGiftAccessories((prev) =>
      prev.includes(accessory)
        ? prev.filter((item) => item !== accessory)
        : [...prev, accessory]
    );
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({
      userType,
      giftRecipient,
      giftAccessories,
      usage,
      brand,
      budgetRange,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Quem vai usar o notebook?</label>
        <div className="radio-group">
          <div className="radio-option">
            <input
              type="radio"
              id="myself"
              name="userType"
              value="myself"
              checked={userType === "myself"}
              onChange={() => handleUserTypeChange("myself")}
            />
            <label htmlFor="myself" className="inline-label">
              Eu mesmo(a)
            </label>
          </div>
          <div className="radio-option">
            <input
              type="radio"
              id="gift"
              name="userType"
              value="gift"
              checked={userType === "gift"}
              onChange={() => handleUserTypeChange("gift")}
            />
            <label htmlFor="gift" className="inline-label">
              Presente para alguém
            </label>
          </div>
        </div>
      </div>

      {isGift && (
        <div className="form-group">
          <label htmlFor="giftRecipient">Quem vai receber o presente?</label>
          <input
            type="text"
            id="giftRecipient"
            className="form-control"
            placeholder="Ex: Minha filha estudante de medicina"
            value={giftRecipient}
            onChange={(e) => setGiftRecipient(e.target.value)}
          />
        </div>
      )}

      {isGift && (
        <div className="form-group">
          <label>Além do notebook, precisa incluir acessórios?</label>
          <div className="gift-accessories-grid">
            {GIFT_ACCESSORIES.map((accessory) => (
              <label
                key={accessory}
                className="budget-option accessory-label"
                htmlFor={`acc-${accessory}`}
              >
                <input
                  type="checkbox"
                  id={`acc-${accessory}`}
                  checked={giftAccessories.includes(accessory)}
                  onChange={() => toggleAccessory(accessory)}
                />
                <span>{accessory}</span>
              </label>
            ))}
          </div>
          <p className="budget-help">
            Essas opções aparecem apenas quando a compra for para presente.
          </p>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="usage">Descreva como você vai usar o notebook</label>
        <textarea
          id="usage"
          className="form-control"
          placeholder={`Exemplos:
- Estudante de engenharia, vou usar AutoCAD e programas de simulação
- Gamer, quero jogar Fortnite, Valorant e The Witcher 3
- Designer gráfico, trabalho com Photoshop e Illustrator
- Uso básico para navegar na internet e assistir vídeos
- Desenvolvedor de software, programo em Python e uso Docker`}
          required
          value={usage}
          onChange={(e) => setUsage(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="brand">Preferência de marca (opcional)</label>
        <select
          id="brand"
          className="form-control"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        >
          <option value="">Sem preferência</option>
          {BRANDS.map((b) => (
            <option key={b} value={b}>
              {b === "Apple" ? "Apple (MacBook)" : b}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Faixa de orçamento</label>
        <div className="budget-options">
          <div className="budget-option">
            <input
              type="radio"
              id="budget-1"
              name="budgetRange"
              value="ate-4000"
              checked={budgetRange === "ate-4000"}
              onChange={() => setBudgetRange("ate-4000")}
            />
            <label htmlFor="budget-1" className="inline-label">
              Até R$ 4.000
            </label>
          </div>
          <div className="budget-option">
            <input
              type="radio"
              id="budget-2"
              name="budgetRange"
              value="4000-6000"
              checked={budgetRange === "4000-6000"}
              onChange={() => setBudgetRange("4000-6000")}
            />
            <label htmlFor="budget-2" className="inline-label">
              De R$ 4.000 a R$ 6.000
            </label>
          </div>
          <div className="budget-option">
            <input
              type="radio"
              id="budget-3"
              name="budgetRange"
              value="acima-6000"
              checked={budgetRange === "acima-6000"}
              onChange={() => setBudgetRange("acima-6000")}
            />
            <label htmlFor="budget-3" className="inline-label">
              Acima de R$ 6.000
            </label>
          </div>
        </div>
        <p className="budget-help">
          As recomendações exibidas respeitam a faixa selecionada.
        </p>
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-full"
        disabled={loading}
      >
        {loading ? "Buscando..." : "Encontrar Notebook Ideal"}
      </button>
    </form>
  );
}
