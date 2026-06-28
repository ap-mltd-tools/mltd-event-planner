import { useState } from "react"
import ApiError from "../Error"
import { useTranslation } from "react-i18next"
import { Copy } from "lucide-react"

export default function Calculate() {

  const { t } =
    useTranslation()

  type SkipTicketUsage = "STOCK" | "SPEND"

  const [form, setForm] = useState({
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

    skipTicketUsage: "SPEND" as SkipTicketUsage,
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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

  const payload = {
    stockPlaysPerHour: toNumber(form.stockPlaysPerHour),
    spendPlaysPerHour: toNumber(form.spendPlaysPerHour),

    stockOperatingSeconds: toSeconds(
      form.stockOperatingHour,
      form.stockOperatingMinute,
      form.stockOperatingSecond
    ),
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
  };
  
  try {
    const res = await fetch("/api/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

      if (res.status === 401) {
      alert("再認証が必要です")
      location.replace("/discord/login")
      return
    }

    const data = await res.json();

    if (!res.ok) {
      throw new ApiError(
        data?.message ?? "サーバーエラーが発生しました",
        res.status
      )
    }
    setResult(data);
  } catch (e) {
    console.error(e)
    const message =
    e instanceof ApiError
      ? e.message
      : "計算できませんでした"
      alert(message)
  } finally {
      setLoading(false);
  }
  };

  const preventWheel = (
    e: React.WheelEvent<HTMLInputElement>
  ) => {
    e.currentTarget.blur()
  }

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

export type TimeParts = {
  sign: string
  h: number
  m: number
  s: number
}

export function toTimeParts(seconds: number): TimeParts {
  const sign = seconds < 0 ? "-" : ""
  const abs = Math.abs(seconds)

  const h = Math.floor(abs / 3600)
  const m = Math.floor((abs %   3600) / 60)
  const s = abs % 60

  return {sign, h, m, s}
}

export function toSeconds(
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

export function toNumber(v: string): number {
  return v === "" ? 0 : Number(v);
}