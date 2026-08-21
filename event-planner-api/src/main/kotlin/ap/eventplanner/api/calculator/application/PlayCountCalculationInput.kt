package ap.eventplanner.api.calculator.application

import ap.eventplanner.api.calculator.domain.SkipTicketUsage

/** 貯め・吐き回数の計算に必要な入力条件 */
data class PlayCountCalculationInput(
    val stockPlaysPerHour: Double,
    val spendPlaysPerHour: Double,
    val operatingSeconds: Int,
    val startDashSecondsPerLap: Int,
    val skipTicketsSecondsPerPlay: Int,
    val songStartTransitionSeconds: Int,
    val startDashPlayCount: Int,
    val skipTicketPlayCount: Int,
    val tenTimesSpendPlayCount: Int,
    val songStartTransitionCount: Int,
    val dailyAddedTriggers: Int,
    val initialTriggers: Int,
    val targetRemainingTriggers: Int,
    val skipTicketUsage: SkipTicketUsage
)