import { useEffect } from "react"
import Header from "../components/Header"
import { useTranslation } from "react-i18next"

export default function AuthPage() {

  const { t } =
    useTranslation()

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
              "/discord/login"
          }}
        >
          {t("auth.discordLogin")}
        </button>

      </div>

    </main>
  )
}