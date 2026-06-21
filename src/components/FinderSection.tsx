"use client";

import CompareBar from "@/components/CompareBar";
import ComparisonModal from "@/components/ComparisonModal";
import NotebookForm, { type FinderFormData } from "@/components/NotebookForm";
import ResultsList from "@/components/ResultsList";
import { openChatWidget } from "@/components/ChatWidget";
import type {
  ComparedNotebook,
  Notebook,
  RecommendationResponse,
} from "@/lib/types";
import { useState } from "react";

export default function FinderSection() {
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<Notebook[]>([]);
  const [budgetLabel, setBudgetLabel] = useState("");
  const [formSnapshot, setFormSnapshot] = useState<FinderFormData | null>(null);
  const [compareSelection, setCompareSelection] = useState<ComparedNotebook[]>(
    []
  );
  const [comparisonOpen, setComparisonOpen] = useState(false);

  async function handleSubmit(data: FinderFormData) {
    setLoading(true);
    setShowResults(false);
    setCompareSelection([]);

    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usage: data.usage,
          brand: data.brand || undefined,
          budgetRange: data.budgetRange,
        }),
      });

      if (!response.ok) throw new Error("Request failed");

      const result = (await response.json()) as RecommendationResponse;
      setRecommendations(result.recommendations);
      setBudgetLabel(result.budgetLabel);
      setFormSnapshot(data);
      setShowResults(true);
    } catch {
      alert("Erro ao buscar recomendações. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function toggleCompare(index: number) {
    const notebook = recommendations[index];
    if (!notebook) return;

    const existing = compareSelection.find((n) => n.index === index);

    if (existing) {
      setCompareSelection((prev) => prev.filter((n) => n.index !== index));
      return;
    }

    if (compareSelection.length >= 4) {
      alert("Você pode comparar no máximo 4 notebooks por vez.");
      return;
    }

    setCompareSelection((prev) => [...prev, { ...notebook, index }]);
  }

  function removeFromCompare(index: number) {
    setCompareSelection((prev) => prev.filter((n) => n.index !== index));
  }

  function clearComparison() {
    setCompareSelection([]);
  }

  function showComparison() {
    if (compareSelection.length < 2) {
      alert("Selecione pelo menos 2 notebooks para comparar.");
      return;
    }
    setComparisonOpen(true);
    document.body.style.overflow = "hidden";
  }

  function closeComparison() {
    setComparisonOpen(false);
    document.body.style.overflow = "auto";
  }

  const compareIndexes = new Set(compareSelection.map((n) => n.index));

  return (
    <div className="finder-section">
      <NotebookForm onSubmit={handleSubmit} loading={loading} />

      {loading && (
        <div className="loading active">
          <div className="spinner" />
          <p>
            Analisando suas necessidades e buscando as melhores opções...
          </p>
        </div>
      )}

      {showResults && formSnapshot && (
        <ResultsList
          recommendations={recommendations}
          userType={formSnapshot.userType}
          giftRecipient={formSnapshot.giftRecipient}
          budgetLabel={budgetLabel}
          giftAccessories={formSnapshot.giftAccessories}
          compareSelection={compareIndexes}
          onToggleCompare={toggleCompare}
          onOpenChat={openChatWidget}
        />
      )}

      <CompareBar
        selected={compareSelection}
        onRemove={removeFromCompare}
        onClear={clearComparison}
        onCompare={showComparison}
      />

      <ComparisonModal
        open={comparisonOpen}
        notebooks={compareSelection}
        onClose={closeComparison}
      />
    </div>
  );
}
