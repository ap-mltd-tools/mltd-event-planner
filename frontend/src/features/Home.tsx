import { useTranslation } from "react-i18next"

export default function Home() {
    const { t } =
      useTranslation()
  return (
  <>
    <section className="section">
      <h2>{t("home.title")}</h2>
    
      <p className="description">
        {t("home.description")}
      </p>
    </section>

    <section className="section">
      <h2>{t("home.contactTitle")}</h2>
      <a href="https://x.com/Apostle_003">
        {t("home.contactLink.twitter")}
      </a>
    </section>
  </>
  );
}