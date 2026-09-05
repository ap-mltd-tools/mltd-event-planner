import { API_BASE_URL } from "../shared/config/env";
import ApiError from "../shared/api/ApiError";

type SkipTicketUsage = "STOCK" | "SPEND";

export type CalculateFormState = {
  stockPlaysPerHour: string;
  spendPlaysPerHour: string;

  stockOperatingHour: string;
  stockOperatingMinute: string;
  stockOperatingSecond: string;

  operatingHour: string;
  operatingMinute: string;
  operatingSecond: string;

  startDashMinutePerLap: string;
  startDashSecondPerLap: string;

  skipTicketsMinutePerPlay: string;
  skipTicketsSecondPerPlay: string;

  songStartTransitionSecond: string;

  startDashCount: string;
  skipTicketCount: string;
  tenTimesCount: string;
  songStartTransitionCount: string;

  dailyTrigger: string;
  initialTrigger: string;
  targetRemainingTrigger: string;

  skipTicketUsage: SkipTicketUsage;
};

export const FORM_STORAGE_KEY = "event-planner.calculate-form";
export const INITIAL_FORM: CalculateFormState = {
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

  skipTicketUsage: "SPEND",
};

type PlayCountCalculationInput = {
  stockPlaysPerHour: number;
  spendPlaysPerHour: number;
  operatingSeconds: number;
  startDashSecondsPerLap: number;
  skipTicketsSecondsPerPlay: number;
  songStartTransitionSeconds: number;
  startDashPlayCount: number;
  skipTicketPlayCount: number;
  tenTimesSpendPlayCount: number;
  songStartTransitionCount: number;
  dailyAddedTriggers: number;
  initialTriggers: number;
  targetRemainingTriggers: number;
  skipTicketUsage: SkipTicketUsage;
};

export type PlayPlanResult = {
  stockPlayCount: number;
  spendPlayCount: number;
  stockSeconds: number;
  spendSeconds: number;
  startDashSeconds: number;
  songStartTransitionSeconds: number;
  remainingTriggers: number;
  remainingSeconds: number;
  skipTicketStockPlayCount: number;
  skipTicketSpendPlayCount: number;
  tenTimesSpendPlayCount: number;
  startDashStockCount: number;
};

export const createPayload = (
  form: CalculateFormState,
): PlayCountCalculationInput => ({
  stockPlaysPerHour: Number(form.stockPlaysPerHour),
  spendPlaysPerHour: Number(form.spendPlaysPerHour),
  operatingSeconds: toSeconds(
    form.operatingHour,
    form.operatingMinute,
    form.operatingSecond,
  ),
  startDashSecondsPerLap: toSeconds(
    undefined,
    form.startDashMinutePerLap,
    form.startDashSecondPerLap,
  ),
  skipTicketsSecondsPerPlay: toSeconds(
    undefined,
    form.skipTicketsMinutePerPlay,
    form.skipTicketsSecondPerPlay,
  ),
  songStartTransitionSeconds: toSeconds(
    undefined,
    undefined,
    form.songStartTransitionSecond,
  ),
  startDashPlayCount: Number(form.startDashCount),
  skipTicketPlayCount: Number(form.skipTicketCount),
  tenTimesSpendPlayCount: Number(form.tenTimesCount),
  songStartTransitionCount: Number(form.songStartTransitionCount),
  dailyAddedTriggers: Number(form.dailyTrigger),
  initialTriggers: Number(form.initialTrigger),
  targetRemainingTriggers: Number(form.targetRemainingTrigger),
  skipTicketUsage: form.skipTicketUsage,
});

function toSeconds(hour?: string, minute?: string, second?: string): number {
  return (
    Number(hour ?? 0) * 3600 + Number(minute ?? 0) * 60 + Number(second ?? 0)
  );
}

export async function calculate(
  payload: PlayCountCalculationInput,
): Promise<PlayPlanResult> {
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
      res.status,
    );
  }

  return data;
}
