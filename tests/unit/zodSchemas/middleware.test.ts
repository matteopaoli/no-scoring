import { describe, it, expect, vi, beforeEach } from "vitest";
import { authorizationMiddleware } from "../../../middleware";
// import type { NextAuthRequest } from "next-auth/lib";
import { NextResponse } from "next/server";

vi.mock("next/server", () => ({
  NextResponse: {
    next: vi.fn(),
    redirect: vi.fn(),
  },
}));

describe("authorizationMiddleware", () => {
  const createMockRequest = (pathname: string, session: any = null) => {
    return {
      nextUrl: { pathname },
      auth: session, // Null or session object
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test for non-reserved pages
  it("should allow access to non-reserved pages", () => {
    const req = createMockRequest("/public-page");
    authorizationMiddleware(req);
    expect(NextResponse.next).toHaveBeenCalled();
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });

  // Test for unauthenticated user on reserved app page
  it("should redirect unauthenticated user to /login for app reserved pages", () => {
    const req = createMockRequest("/app/dashboard");
    authorizationMiddleware(req);
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: "/login" })
    );
  });

  // Test for unauthenticated user on reserved admin page
  it("should redirect unauthenticated user to /admin/login for admin reserved pages", () => {
    const req = createMockRequest("/admin/settings");
    authorizationMiddleware(req);
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: "/admin/login" })
    );
  });

  // Test for unauthenticated user on reserved partner page
  it("should redirect unauthenticated user to /partner/login for partner reserved pages", () => {
    const req = createMockRequest("/partner/dashboard");
    authorizationMiddleware(req);
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: "/partner/login" })
    );
  });

  // Test for authenticated user with wrong role on app reserved page
  it("should redirect authenticated user with wrong role to /login for app reserved pages", () => {
    const req = createMockRequest("/app/dashboard", {
      user: { role: "admin" },
    });
    authorizationMiddleware(req);
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: "/login" })
    );
  });

  // Test for authenticated user with wrong role on admin reserved page
  it("should redirect authenticated user with wrong role to /admin/login for admin reserved pages", () => {
    const req = createMockRequest("/admin/settings", {
      user: { role: "user" },
    });
    authorizationMiddleware(req);
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: "/admin/login" })
    );
  });

  // Test for authenticated user with wrong role on partner reserved page
  it("should redirect authenticated user with wrong role to /partner/login for partner reserved pages", () => {
    const req = createMockRequest("/partner/dashboard", {
      user: { role: "user" },
    });
    authorizationMiddleware(req);
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: "/partner/login" })
    );
  });

  // Test for authenticated user with correct role on app reserved page
  it("should allow authenticated user with correct role to access app reserved pages", () => {
    const req = createMockRequest("/app/dashboard", {
      user: { role: "user" },
    });
    authorizationMiddleware(req);
    expect(NextResponse.next).toHaveBeenCalled();
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });

  // Test for authenticated user with correct role on admin reserved page
  it("should allow authenticated user with correct role to access admin reserved pages", () => {
    const req = createMockRequest("/admin/settings", {
      user: { role: "admin" },
    });
    authorizationMiddleware(req);
    expect(NextResponse.next).toHaveBeenCalled();
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });

  // Test for authenticated user with correct role on partner reserved page
  it("should allow authenticated user with correct role to access partner reserved pages", () => {
    const req = createMockRequest("/partner/dashboard", {
      user: { role: "partner" },
    });
    authorizationMiddleware(req);
    expect(NextResponse.next).toHaveBeenCalled();
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });

  // Test for authenticated subpartner on partner reserved page
  it("should allow authenticated subpartner to access partner reserved pages", () => {
    const req = createMockRequest("/partner/dashboard", {
      user: { role: "subpartner" },
    });
    authorizationMiddleware(req);
    expect(NextResponse.next).toHaveBeenCalled();
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });
});
