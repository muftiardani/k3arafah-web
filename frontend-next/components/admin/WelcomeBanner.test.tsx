import { render, screen } from "@testing-library/react";
import { WelcomeBanner } from "./WelcomeBanner";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("WelcomeBanner", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it("renders default greeting when no user is in localStorage", () => {
    render(<WelcomeBanner />);
    expect(screen.getByText(/Selamat Datang, Admin!/i)).toBeInTheDocument();
  });

  it("renders user greeting when user is in localStorage", () => {
    const user = { username: "SantriUser", role: "santri" };
    localStorage.setItem("user", JSON.stringify(user));

    render(<WelcomeBanner />);
    expect(screen.getByText(/Selamat Datang, SantriUser!/i)).toBeInTheDocument();
  });
});
