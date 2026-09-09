import { useState } from "react";
import { useEffect } from "react";
import AuthPage from "../pages/Auth";
import Dashboard from "../pages/dashboard/Dashboard";
import ApiError from "../shared/api/ApiError";

export default function App() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(`/discord/status`, {
          credentials: "include",
        });

        if (res.status === 401) {
          setAuthenticated(false);
          return;
        }

        if (res.status === 403) {
          setAuthenticated(false);
          alert("アクセス権限が確認できませんでした");
          return;
        }

        if (!res.ok) {
          const data = await res.json();
          throw new ApiError(
            data?.message ?? "サーバーエラーが発生しました",
            res.status,
          );
        }

        setAuthenticated(true);
      } catch (e) {
        setAuthenticated(false);
        console.error(e);
        const message =
          e instanceof ApiError ? e.message : "認証状態の取得に失敗しました";
        alert(message);
      }
    }

    checkAuth();
  }, []);

  if (authenticated === null) {
    return <div translate="no">Loading...</div>;
  }

  return authenticated ? <Dashboard /> : <AuthPage />;
}
