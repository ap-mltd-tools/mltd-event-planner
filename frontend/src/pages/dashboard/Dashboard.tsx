import { useState } from "react"
import Header from "../../shared/ui/Header"
import Calculate from "./CalculateTab"
import Home from "./HomeTab"
import { useTranslation } from "react-i18next"

export default function Dashboard() {

    const { t } = useTranslation()

    type Tab =
  | "home"
  | "calculate"

  const screens = {
    home: <Home />,
    calculate: <Calculate />
  }

  const [tab, setTab] =
    useState<Tab>("home")

  return (
    <div className="app">

      <Header />

      <nav className="tabs">
        <button className="tab"
          onClick={() => setTab("home")}
        >
          {t("dashboard.home")}
        </button>

        <button className="tab"
          onClick={() => setTab("calculate")}
        >
          {t("dashboard.stockAndSpendPlayCalculator")}
        </button>
      </nav>

      <main className="content">
        {screens[tab]}
      </main>

    </div>
  )
}