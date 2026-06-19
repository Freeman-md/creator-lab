import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import { PostEditorForm } from "@/modules/posts/components/post-editor-form";

describe("PostEditorForm", () => {
  test("shows validation errors for missing required fields", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <PostEditorForm
        title="New post"
        submitLabel="Create post"
        onSubmit={onSubmit}
      />
    );

    await user.click(screen.getByRole("button", { name: /create post/i }));

    expect(await screen.findByText(/post body is required/i)).toBeInTheDocument();
    expect(screen.getByText(/publish date and time are required/i)).toBeInTheDocument();
    expect(screen.getByText(/^goal is required/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test("submits trimmed values and omits an empty title", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <PostEditorForm
        title="New post"
        submitLabel="Create post"
        onSubmit={onSubmit}
      />
    );

    await user.type(screen.getByLabelText(/post body/i), "  A complete post body  ");
    await user.type(screen.getByLabelText(/published date and time/i), "2026-06-19T08:30");
    await user.type(screen.getByLabelText(/^goal$/i), "  Educate builders  ");
    await user.type(screen.getByLabelText(/category/i), "  Building in public  ");
    await user.type(screen.getByLabelText(/audience/i), "  Founders  ");

    await user.click(screen.getByRole("button", { name: /create post/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: undefined,
      body: "A complete post body",
      publishedDateTime: new Date("2026-06-19T08:30").toISOString(),
      goal: "Educate builders",
      category: "Building in public",
      audience: "Founders",
    });
  });
});
