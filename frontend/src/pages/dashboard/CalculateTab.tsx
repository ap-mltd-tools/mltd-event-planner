import { useState } from "react"
import ApiError from "../../shared/api/ApiError"
import { API_BASE_URL } from "../../shared/config/env"
import { useTranslation } from "react-i18next"
import { Copy } from "lucide-react"

type SkipTicketUsage = "STOCK" | "SPEND"

type CalculateFormState = {
  stockPlaysPerHour: string
  spendPlaysPerHour: string

  stockOperatingHour: string
  stockOperatingMinute: string
  stockOperatingSecond: string

  operatingHour: string
  operatingMinute: string
  operatingSecond: string

  startDashMinutePerLap: string
  startDashSecondPerLap: string

  skipTicketsMinutePerPlay: string
  skipTicketsSecondPerPlay: string

  songStartTransitionSecond: string

  startDashCount: string
  skipTicketCount: string
  tenTimesCount: string
  songStartTransitionCount: string

  dailyTrigger: string
  initialTrigger: string
  targetRemainingTrigger: string

  skipTicketUsage: SkipTicketUsage
}

const INITIAL_FORM: CalculateFormState = {
  stockPlaysPerHour: "17.1",
  spendPlaysPerHour: "21.1",

  stockOperatingHour: "0",
  stockOperatingMinute: "0",
  stockOperatingSecond: "0",

  operatingHour: "0",
  operatingMinute: "0",
  operatingSecond: "0",

  startDashMinutePerLap: "10",
  startDashSecondPerLap: "0",

  skipTicketsMinutePerPlay: "0",
  skipTicketsSecondPerPlay: "0",

  songStartTransitionSecond: "15",

  startDashCount: "1",
  skipTicketCount: "0",
  tenTimesCount: "1",
  songStartTransitionCount: "1",

  dailyTrigger: "4540",
  initialTrigger: "0",
  targetRemainingTrigger: "0",

  skipTicketUsage: "SPEND"
}

type PlayCountCalculationInput = {
  stockPlaysPerHour: number
  spendPlaysPerHour: number
  operatingSeconds: number
  startDashSecondsPerLap: number
  skipTicketsSecondsPerPlay: number
  songStartTransitionSeconds: number
  startDashPlayCount: number
  skipTicketPlayCount: number
  tenTimesSpendPlayCount: number
  songStartTransitionCount: number
  dailyAddedTriggers: number
  initialTriggers: number
  targetRemainingTriggers: number
  skipTicketUsage: SkipTicketUsage
}

const createPayload = (form: CalculateFormState): PlayCountCalculationInput => ({
    stockPlaysPerHour: toNumber(form.stockPlaysPerHour),
    spendPlaysPerHour: toNumber(form.spendPlaysPerHour),
    operatingSeconds: toSeconds(
      form.operatingHour,
      form.operatingMinute,
      form.operatingSecond
    ),
    startDashSecondsPerLap: toSeconds(
      undefined,
      form.startDashMinutePerLap,
      form.startDashSecondPerLap
    ),
    skipTicketsSecondsPerPlay: toSeconds(
      undefined,
      form.skipTicketsMinutePerPlay,
      form.skipTicketsSecondPerPlay
    ),
    songStartTransitionSeconds: toSeconds(
      undefined,
      undefined,
      form.songStartTransitionSecond
    ),
    startDashPlayCount: toNumber(form.startDashCount),
    skipTicketPlayCount: toNumber(form.skipTicketCount),
    tenTimesSpendPlayCount: toNumber(form.tenTimesCount),
    songStartTransitionCount: toNumber(form.songStartTransitionCount),
    dailyAddedTriggers: toNumber(form.dailyTrigger),
    initialTriggers: toNumber(form.initialTrigger),
    targetRemainingTriggers: toNumber(form.targetRemainingTrigger),
    skipTicketUsage: form.skipTicketUsage
})

async function calculate(payload: PlayCountCalculationInput): Promise<PlayPlanResult> {
    const res = await fetch(`${API_BASE_URL}/api/calculate`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

    if (!res.ok) {
    throw new ApiError(
      data?.message ?? "サーバーエラーが発生しました",
      res.status
    )
  }

  return data
}

type PlayPlanResult = {
  stockPlayCount: number
  spendPlayCount: number
  stockSeconds: number
  spendSeconds: number
  startDashSeconds: number
  songStartTransitionSeconds: number
  remainingTriggers: number
  remainingSeconds: number
  skipTicketStockPlayCount: number
  skipTicketSpendPlayCount: number
  tenTimesSpendPlayCount: number
  startDashStockCount: number
}

type TimeParts = {
  sign: string
  h: number
  m: number
  s: number
}

const preventWheel = (
  e: React.WheelEvent<HTMLInputElement>
) => {
  e.currentTarget.blur()
}

function toTimeParts(seconds: number): TimeParts {
  const sign = seconds < 0 ? "-" : ""
  const abs = Math.abs(seconds)

  const h = Math.floor(abs / 3600)
  const m = Math.floor((abs %   3600) / 60)
  const s = abs % 60

  return {sign, h, m, s}
}

function toSeconds(
  hour?: string,
  minute?: string,
  second?: string
): number {
  return (
    Number(hour ?? 0) * 3600 +
    Number(minute ?? 0) * 60 +
    Number(second ?? 0)
  )
}

function toNumber(v: string): number {
  return v === "" ? 0 : Number(v);
}

export default function Calculate() {

  const { t } = useTranslation()
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlayPlanResult | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true)

  const payload = createPayload(form);

    try {
      const result = await calculate(payload)

      setResult(result);
    } catch (e) {
      console.error(e)

      if (e instanceof ApiError && e.status === 401) {
        alert("再認証が必要です")
        location.replace(`${API_BASE_URL}/discord/login`)
        return
      }

      const message =
        e instanceof ApiError
          ? e.message
          : "計算できませんでした"
        alert(message)
    } finally {
        setLoading(false);
    }
  };

  const resultTexts = result
  ? [
      t("calculate.result.stockPlayCount", {
        count: result.stockPlayCount,
        skip: result.skipTicketStockPlayCount,
      }),
      t("calculate.result.spendPlayCount", {
        count: result.spendPlayCount,
        skip: result.skipTicketSpendPlayCount,
        ten: result.tenTimesSpendPlayCount,
      }),
      t(
        "calculate.result.stockSeconds",
        toTimeParts(result.stockSeconds)
      ),
      t(
        "calculate.result.spendSeconds",
        toTimeParts(result.spendSeconds)
      ),
      t("calculate.result.startDashSeconds", {
        ...toTimeParts(result.startDashSeconds),
        count: result.startDashStockCount,
      }),
      t(
        "calculate.result.songStartTransitionSeconds",
        toTimeParts(result.songStartTransitionSeconds)
      ),
      t(
        "calculate.result.remainingSeconds",
        toTimeParts(result.remainingSeconds)
      ),
      t("calculate.result.remainingTriggers", {
        count: result.remainingTriggers,
      }),
    ]
  : [];

  const copyResult = async () => {
    await navigator.clipboard.writeText(resultTexts.join("\n"))
  }

  return (
  <>
    <section className="section">
      <h2>{t("calculate.title")}</h2>
    </section>

    <div className="field">
      <label>{t("calculate.labels.stockPlaysPerHour")}</label>
      <small className="field-description">
        {t("calculate.descriptions.stockPlaysPerHour")}
      </small>
      <input
        name="stockPlaysPerHour"
        placeholder=""
        value={form.stockPlaysPerHour}
        onChange={handleChange}
        type="number"
        onWheel={preventWheel}
        min={0}
        step="0.1"
      />
    </div>

    <div className="field">
      <label>{t("calculate.labels.spendPlaysPerHour")}</label>
      <small className="field-description">
        {t("calculate.descriptions.spendPlaysPerHour")}
      </small>
      <input
        name="spendPlaysPerHour"
        placeholder=""
        value={form.spendPlaysPerHour}
        onChange={handleChange}
        type="number"
        onWheel={preventWheel}
        min={0}
        step="0.1"
      />
    </div>

    <div className="field">
      <label>{t("calculate.labels.operatingTime")}</label>
      <small className="field-description">
        {t("calculate.descriptions.operatingTime")}
      </small>
      <div className="time-input-row">
        <div className="time-group">
          <input
            name="operatingHour"
            value={form.operatingHour}
            onChange={handleChange}
            placeholder=""
            type="number"
            onWheel={preventWheel}
            min={0}
          />
          <span>{t("common.time.hour")}</span>
        </div>

        <div className="time-group">
          <input
            name="operatingMinute"
            value={form.operatingMinute}
            onChange={handleChange}
            placeholder=""
            type="number"
            onWheel={preventWheel}
            min={0}
            max={59}
          />
          <span>{t("common.time.minute")}</span>
        </div>

        <div className="time-group">
          <input
            name="operatingSecond"
            value={form.operatingSecond}
            onChange={handleChange}
            placeholder=""
            type="number"
            onWheel={preventWheel}
            min={0}
            max={59}
          />
          <span>{t("common.time.second")}</span>
        </div>
      </div>
    </div>

    <div className="field">
      <label>{t("calculate.labels.startDashCount")}</label>
      <small className="field-description">
        {t("calculate.descriptions.startDashCount")}
      </small>
      <input
        name="startDashCount"
        placeholder=""
        value={form.startDashCount}
        onChange={handleChange}
        type="number"
        onWheel={preventWheel}
        min={0}
      />
    </div>

    <div className="field">
      <label>{t("calculate.labels.startDashTime")}</label>
      <small className="field-description">
        {t("calculate.descriptions.startDashTime")}
      </small>
      <div className="time-input-row">
        <div className="time-group">
          <input
            name="startDashMinutePerLap"
            value={form.startDashMinutePerLap}
            onChange={handleChange}
            placeholder=""
            type="number"
            onWheel={preventWheel}
            min={0}
            max={59}
          />
          <span>{t("common.time.minute")}</span>
        </div>

        <div className="time-group">
          <input
            name="startDashSecondPerLap"
            value={form.startDashSecondPerLap}
            onChange={handleChange}
            placeholder=""
            type="number"
            onWheel={preventWheel}
            min={0}
            max={59}
          />
          <span>{t("common.time.second")}</span>
        </div>
      </div>
    </div>

    <div className="field">
      <label>{t("calculate.labels.skipTicketCount")}</label>
      <small className="field-description">
        {t("calculate.descriptions.skipTicketCount")}
      </small>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="skipTicketUsage"
              value="SPEND"
              checked={form.skipTicketUsage === "SPEND"}
              onChange={handleChange}
            />
            {t("calculate.options.useForSpend")}
          </label>
          <label>
            <input
              type="radio"
              name="skipTicketUsage"
              value="STOCK"
              checked={form.skipTicketUsage === "STOCK"}
              onChange={handleChange}
            />
            {t("calculate.options.useForStock")}
          </label>
        </div>
      <input
        name="skipTicketCount"
        placeholder=""
        value={form.skipTicketCount}
        onChange={handleChange}
        type="number"
        onWheel={preventWheel}
        min={0}
      />
    </div>

    <div className="field">
      <label>{t("calculate.labels.skipTicketsTime")}</label>
      <small className="field-description">
        {t("calculate.descriptions.skipTicketsTime")}
      </small>
      <div className="time-input-row">
        <div className="time-group">
          <input
            name="skipTicketsMinutePerPlay"
            value={form.skipTicketsMinutePerPlay}
            onChange={handleChange}
            placeholder=""
            type="number"
            onWheel={preventWheel}
            min={0}
            max={59}
          />
          <span>{t("common.time.minute")}</span>
        </div>

        <div className="time-group">
          <input
            name="skipTicketsSecondPerPlay"
            value={form.skipTicketsSecondPerPlay}
            onChange={handleChange}
            placeholder=""
            type="number"
            onWheel={preventWheel}
            min={0}
            max={59}
          />
          <span>{t("common.time.second")}</span>
        </div>
      </div>
    </div>

    <div className="field">
      <label>{t("calculate.labels.tenTimesCount")}</label>
      <small className="field-description">
        {t("calculate.descriptions.tenTimesCount")}
      </small>
      <input
        name="tenTimesCount"
        placeholder=""
        value={form.tenTimesCount}
        onChange={handleChange}
        type="number"
        onWheel={preventWheel}
        min={0}
      />
    </div>

    <div className="field">
      <label>{t("calculate.labels.dailyTrigger")}</label>
      <small className="field-description">
        {t("calculate.descriptions.dailyTrigger")}
      </small>
      <input
        name="dailyTrigger"
        placeholder=""
        value={form.dailyTrigger}
        onChange={handleChange}
        type="number"
        onWheel={preventWheel}
        min={0}
        step="10"
      />
    </div>

    <div className="field">
      <label>{t("calculate.labels.initialTrigger")}</label>
      <small className="field-description">
        {t("calculate.descriptions.initialTrigger")}
      </small>
      <input
        name="initialTrigger"
        placeholder=""
        value={form.initialTrigger}
        onChange={handleChange}
        type="number"
        onWheel={preventWheel}
        min={0}
        step="1"
      />
    </div>

    <div className="field">
      <label>{t("calculate.labels.targetRemainingTrigger")}</label>
      <small className="field-description">
        {t("calculate.descriptions.targetRemainingTrigger")}
      </small>
      <input
        name="targetRemainingTrigger"
        placeholder=""
        value={form.targetRemainingTrigger}
        onChange={handleChange}
        type="number"
        onWheel={preventWheel}
        min={0}
        step="1"
      />
    </div>

    <div className="field">
      <label>{t("calculate.labels.songStartTransitionCount")}</label>
      <small className="field-description">
        {t("calculate.descriptions.songStartTransitionCount")}
      </small>
      <input
        name="songStartTransitionCount"
        placeholder=""
        value={form.songStartTransitionCount}
        onChange={handleChange}
        type="number"
        onWheel={preventWheel}
        min={0}
      />
    </div>

    <div className="field">
      <label>{t("calculate.labels.songStartTransitionSecond")}</label>
      <small className="field-description">
        {t("calculate.descriptions.songStartTransitionSecond")}
      </small>
      <div className="time-input-row">
        <div className="time-group">
          <input
            name="songStartTransitionSecond"
            value={form.songStartTransitionSecond}
            onChange={handleChange}
            placeholder=""
            type="number"
            onWheel={preventWheel}
            min={0}
            max={59}
          />
          <span>{t("common.time.second")}</span>
        </div>
      </div>
    </div>

    <div className="field">
      <button onClick={handleSubmit}>
        {t("calculate.actions.calculate")}
      </button>
    </div>

    <div className="field">
      {loading && <p>{t("calculate.loading")}</p>}
    </div>

      {result && (
        <div className="field">
          <h3>{t("calculate.result.title")}</h3>

          <div className="copy-button">
            <button onClick={copyResult}>
              <Copy size={16} />
            </button>
          </div>

          {resultTexts.map((text, index) => (
            <div key={index}>{text}</div>
          ))}

        </div>
      )}
  </>
  );
}