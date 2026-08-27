import { useState } from "react"
import { useEffect } from "react"
import AuthPage from "../pages/Auth"
import Dashboard from "../pages/dashboard/Dashboard"
import ApiError from "../shared/api/ApiError"
import { API_BASE_URL } from "../shared/config/env"

export default function App() {
    const [authenticated, setAuthenticated] =
    useState<boolean | null>(null)
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(`${API_BASE_URL}/discord/status`, {
          credentials: "include"
        })

        if (res.status === 401) {
          setAuthenticated(false)
          return
        }

        if (!res.ok) {
          const data = await res.json();
          throw new ApiError(
            data?.message ?? "サーバーエラーが発生しました",
            res.status
          )
        }

        setAuthenticated(true)

      } catch(e) {
        setAuthenticated(false)
        console.error(e)
        const message = 
        e instanceof ApiError
          ? e.message
          : "認証状態の取得に失敗しました"
          alert(message)
      }
    }

    checkAuth()

  }, [])

  if (authenticated === null) {
    return <>Loading...</>
  }

  return authenticated
    ? <Dashboard />
    : <AuthPage />
}