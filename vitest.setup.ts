import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// jsdom does not implement scrollIntoView; ChatWidget calls it in an effect.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn();
}
