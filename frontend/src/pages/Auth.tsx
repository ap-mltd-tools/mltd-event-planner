import Header from "../app/layouts/SiteLayout";
import { useTranslation } from "react-i18next";

export default function AuthPage() {
  const { t } = useTranslation();

  return (
    <main className="app">
      <Header />

      <div className="auth">
        <button
          className="login-button"
          onClick={() => {
            location.href = `/oauth2/authorization/discord`;
          }}
        >
          {t("auth.discordLogin")}
        </button>
      </div>
    </main>
  );
}
