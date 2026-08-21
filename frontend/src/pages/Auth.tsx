import { useEffect } from "react"
import Header from "../shared/ui/Header"
import { useTranslation } from "react-i18next"

export default function AuthPage() {

  const { t } = useTranslation()

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    if(params.get("auth")==="failed") {
      alert("アクセス権限が確認できませんでした")

      params.delete("auth")
      window.history.replaceState({}, "", "/")
    }
  }, [])

  return (
    <main className="app">

      <Header />

      <div className="auth">

        <button
          className="login-button"
          onClick={() => {
            location.href =
              `${API_BASE_URL}/discord/login`
          }}
        >
          {t("auth.discordLogin")}
        </button>

      </div>

    </main>
  )
}