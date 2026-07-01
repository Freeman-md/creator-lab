import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import { LinkedInProfileUrlForm } from "@/modules/profiles/components/linkedin-profile-url-form";

describe("LinkedInProfileUrlForm", () => {
  test("rejects invalid LinkedIn profile URLs", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <LinkedInProfileUrlForm submitLabel="Save profile" onSubmit={onSubmit} />
    );

    await user.type(screen.getByLabelText(/linkedin profile url/i), "https://example.com/me");
    await user.click(screen.getByRole("button", { name: /save profile/i }));

    expect(
      await screen.findByText(/enter a linkedin profile url/i)
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test("submits trimmed valid LinkedIn profile URL", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <LinkedInProfileUrlForm submitLabel="Save profile" onSubmit={onSubmit} />
    );

    await user.type(
      screen.getByLabelText(/linkedin profile url/i),
      "  https://www.linkedin.com/in/freeman-madudili-9864101a2/  "
    );
    await user.click(screen.getByRole("button", { name: /save profile/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      linkedinProfileUrl:
        "https://www.linkedin.com/in/freeman-madudili-9864101a2/",
    });
  });
});
