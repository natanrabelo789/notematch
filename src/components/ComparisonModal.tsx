"use client";

import type { ComparedNotebook } from "@/lib/types";
import { useState } from "react";

interface ComparisonModalProps {
  open: boolean;
  notebooks: ComparedNotebook[];
  onClose: () => void;
}

const SPECS = [
  { label: "Processador", key: "processor" as const },
  { label: "Memória RAM", key: "ram" as const },
  { label: "Armazenamento", key: "storage" as const },
  { label: "Placa de Vídeo", key: "gpu" as const },
  { label: "Tela", key: "screen" as const },
  { label: "Descrição", key: "description" as const },
  { label: "Por que recomendamos", key: "reason" as const },
];

export default function ComparisonModal({
  open,
  notebooks,
  onClose,
}: ComparisonModalProps) {
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);

  if (!open) return null;

  return (
    <div
      className="comparison-modal active"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="comparison-title"
    >
      <div className="comparison-content">
        <div className="comparison-header">
          <h2 id="comparison-title" style={{ margin: 0 }}>
            Comparação de Notebooks
          </h2>
          <button
            type="button"
            className="comparison-close"
            onClick={onClose}
            aria-label="Fechar comparação"
          >
            &times;
          </button>
        </div>
        <div className="comparison-body">
          <div className="toggle-differences">
            <input
              type="checkbox"
              id="showDifferencesOnly"
              checked={showDifferencesOnly}
              onChange={(e) => setShowDifferencesOnly(e.target.checked)}
            />
            <label htmlFor="showDifferencesOnly" className="inline-label">
              Mostrar apenas diferenças
            </label>
          </div>
          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Especificação</th>
                  {notebooks.map((nb) => (
                    <th key={nb.index}>
                      <div className="comparison-product-name">{nb.name}</div>
                      <div className="comparison-product-brand">{nb.brand}</div>
                      <div className="comparison-product-price">{nb.price}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SPECS.map((spec) => {
                  const values = notebooks.map((nb) => nb[spec.key]);
                  const isDifferent = new Set(values).size > 1;

                  if (showDifferencesOnly && !isDifferent) return null;

                  return (
                    <tr
                      key={spec.key}
                      className={isDifferent ? "row-different" : "row-same"}
                    >
                      <td>{spec.label}</td>
                      {notebooks.map((nb) => (
                        <td key={nb.index}>
                          {isDifferent ? (
                            <span className="spec-highlight">
                              {nb[spec.key]}
                            </span>
                          ) : (
                            nb[spec.key]
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
