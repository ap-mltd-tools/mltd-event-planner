import { useTranslation } from "react-i18next"

export default function Header() {

  const { t, i18n } =
    useTranslation()

  return (
    <header className="header">

      <select
        className="language-select"
        value={i18n.language}
        onChange={(e) =>
          i18n.changeLanguage(
            e.target.value
          )
        } 
      >

        <option value="ja">
          日本語
        </option>

        <option value="en">
          English
        </option>
      </select>

      <h1 className="header-title">
        {t("header.title")}
      </h1>
    </header>
  )
}