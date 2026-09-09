import { useState } from "react";
import ApiError from "../../shared/api/ApiError";
import {
  FORM_STORAGE_KEY,
  INITIAL_FORM,
  createPayload,
  calculate,
} from "../../features/calculate";
import type {
  CalculateFormState,
  PlayPlanResult,
} from "../../features/calculate";
import { useTranslation } from "react-i18next";
import { Copy } from "lucide-react";

const preventWheel = (e: React.WheelEvent<HTMLInputElement>) => {
  e.currentTarget.blur();
};

type TimeParts = {
  sign: string;
  h: number;
  m: number;
  s: number;
};

function toTimeParts(seconds: number): TimeParts {
  const sign = seconds < 0 ? "-" : "";
  const abs = Math.abs(seconds);

  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = abs % 60;

  return { sign, h, m, s };
}

export default function Calculate() {
  const { t } = useTranslation();
  const [form, setForm] = useState<CalculateFormState>(() => {
    try {
      const savedForm = localStorage.getItem(FORM_STORAGE_KEY);
      return savedForm
        ? {
            ...INITIAL_FORM,
            ...(JSON.parse(savedForm) as Partial<CalculateFormState>),
          }
        : INITIAL_FORM;
    } catch {
      return INITIAL_FORM;
    }
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlayPlanResult | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const nextForm = {
      ...form,
      [name]: value,
    };
    setForm(nextForm);
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(nextForm));
  };

  const handleSubmit = async () => {
    setLoading(true);

    const payload = createPayload(form);

    try {
      const result = await calculate(payload);

      setResult(result);
    } catch (e) {
      console.error(e);
      const message =
        e instanceof ApiError ? e.message : "計算できませんでした";
      alert(message);
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
        t("calculate.result.stockSeconds", toTimeParts(result.stockSeconds)),
        t("calculate.result.spendSeconds", toTimeParts(result.spendSeconds)),
        t("calculate.result.startDashSeconds", {
          ...toTimeParts(result.startDashSeconds),
          count: result.startDashStockCount,
        }),
        t(
          "calculate.result.songStartTransitionSeconds",
          toTimeParts(result.songStartTransitionSeconds),
        ),
        t(
          "calculate.result.remainingSeconds",
          toTimeParts(result.remainingSeconds),
        ),
        t("calculate.result.remainingTriggers", {
          count: result.remainingTriggers,
        }),
      ]
    : [];

  const copyResult = async () => {
    await navigator.clipboard.writeText(resultTexts.join("\n"));
  };

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

      <div className="field">{loading && <p>{t("calculate.loading")}</p>}</div>

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
