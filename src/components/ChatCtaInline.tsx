"use client";

interface ChatCtaInlineProps {
  title?: string;
  description?: string;
  buttonLabel?: string;
  onOpenChat: () => void;
}

export default function ChatCtaInline({
  title,
  description,
  buttonLabel = "Solicitar ajuda gratuita",
  onOpenChat,
}: ChatCtaInlineProps) {
  return (
    <div className="chat-cta-inline">
      <div>
        {title && <strong>{title}</strong>}
        {description && (
          <p
            style={{
              margin: title ? "6px 0 0" : 0,
              color: "var(--color-text-secondary)",
            }}
          >
            {description}
          </p>
        )}
      </div>
      <button type="button" className="btn btn-primary" onClick={onOpenChat}>
        {buttonLabel}
      </button>
    </div>
  );
}
