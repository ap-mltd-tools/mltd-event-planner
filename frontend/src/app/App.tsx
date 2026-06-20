import { useState } from "react"
import { useEffect } from "react"
import AuthPage from "./Auth"
import Dashboard from "./Dashboard"
import ApiError from "../Error"

export default function App() {
    const [authenticated, setAuthenticated] =
    useState<boolean | null>(null)

  useEffect(() => {

    async function checkAuth() {
      try {
        const res = await fetch("/discord/status", {
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