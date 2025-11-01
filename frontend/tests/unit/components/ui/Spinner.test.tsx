import { render, screen } from "@testing-library/react";
import Spinner from "../../../../src/components/ui/Spinner";

describe("Spinner", () => {
  it("renders with default props", () => {
    render(<Spinner />);
    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute("aria-label", "読み込み中");
  });

  it("accepts size and color props", () => {
    render(<Spinner size={48} color="text-red-500" />);
    const svg = screen.getByRole("status").querySelector("svg");
    expect(svg).toHaveAttribute("width", "48");
    expect(svg).toHaveClass("text-red-500");
  });

  it("accepts className prop", () => {
    render(<Spinner className="my-spinner" />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("my-spinner");
  });
});
