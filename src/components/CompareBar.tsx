"use client";

import type { ComparedNotebook } from "@/lib/types";

interface CompareBarProps {
  selected: ComparedNotebook[];
  onRemove: (index: number) => void;
  onClear: () => void;
  onCompare: () => void;
}

export default function CompareBar({
  selected,
  onRemove,
  onClear,
  onCompare,
}: CompareBarProps) {
  if (selected.length === 0) return null;

  return (
    <div className="compare-section active">
      <div className="compare-bar">
        <div className="compare-items">
          {selected.map((nb) => (
            <div key={nb.index} className="compare-chip">
              <span>{nb.name}</span>
              <button
                type="button"
                className="compare-chip-remove"
                onClick={() => onRemove(nb.index)}
                aria-label={`Remover ${nb.name}`}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <div className="compare-actions">
          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={onClear}
          >
            Limpar
          </button>
          <button
            type="button"
            className="btn btn-primary btn-small"
            onClick={onCompare}
          >
            Comparar ({selected.length})
          </button>
        </div>
      </div>
    </div>
  );
}
