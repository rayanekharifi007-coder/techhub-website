"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
    router.push("/");
  };

  return (
    <button type="button" onClick={logout} className="tech-button secondary text-xs">
      Logout
    </button>
  );
}
