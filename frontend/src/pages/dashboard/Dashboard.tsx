import Header from "../../shared/ui/Header"
import Calculate from "./CalculateTab"
import Home from "./HomeTab"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"

const screens = {
  home: <Home />,
  calculate: <Calculate />
}
type Tab = keyof typeof screens
const isTab = (value: string | null): value is Tab =>
  value !==null && Object.hasOwn(screens, value)

export default function Dashboard() {

  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get("tab")
  const tab: Tab = isTab(tabParam)
    ? tabParam
    : "home"
  const changeTab = (tab: Tab) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set("tab", tab)
      return next
    })
  }

  return (
    <div className="app">

      <Header />

      <nav className="tabs">
        <button className="tab"
          onClick={() => changeTab("home")}
        >
          {t("dashboard.home")}
        </button>

        <button className="tab"
          onClick={() => changeTab("calculate")}
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