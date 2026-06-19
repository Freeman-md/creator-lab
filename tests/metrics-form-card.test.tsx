import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import { MetricsFormCard } from "@/modules/metrics/components/metrics-form-card";

describe("MetricsFormCard", () => {
  test("defaults missing metric values to zero in the form", () => {
    render(<MetricsFormCard onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/impressions/i)).toHaveValue(0);
    expect(screen.getByLabelText(/reactions/i)).toHaveValue(0);
    expect(screen.getByLabelText(/comments/i)).toHaveValue(0);
    expect(screen.getByLabelText(/reposts/i)).toHaveValue(0);
    expect(screen.getByLabelText(/profile visits/i)).toHaveValue(0);
  });

  test("submits numeric metric values", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<MetricsFormCard onSubmit={onSubmit} />);

    await user.clear(screen.getByLabelText(/impressions/i));
    await user.type(screen.getByLabelText(/impressions/i), "1200");
    await user.clear(screen.getByLabelText(/reactions/i));
    await user.type(screen.getByLabelText(/reactions/i), "42");
    await user.clear(screen.getByLabelText(/comments/i));
    await user.type(screen.getByLabelText(/comments/i), "8");
    await user.clear(screen.getByLabelText(/reposts/i));
    await user.type(screen.getByLabelText(/reposts/i), "2");
    await user.clear(screen.getByLabelText(/profile visits/i));
    await user.type(screen.getByLabelText(/profile visits/i), "15");

    await user.click(screen.getByRole("button", { name: /save metrics/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      impressions: 1200,
      reactions: 42,
      comments: 8,
      reposts: 2,
      profileVisits: 15,
    });
  });
});
