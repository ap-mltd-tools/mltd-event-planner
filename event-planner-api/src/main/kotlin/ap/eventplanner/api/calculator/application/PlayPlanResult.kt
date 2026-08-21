package ap.eventplanner.api.calculator.application

/** 最適な貯め・吐き回数に基づく稼働計画の計算結果 */
data class PlayPlanResult (
    val stockPlayCount: Int,
    val spendPlayCount: Int,
    val stockSeconds: Int,
    val spendSeconds: Int,
    val startDashSeconds: Int,
    val songStartTransitionSeconds: Int,
    val remainingTriggers: Int,
    val remainingSeconds: Int,
    val skipTicketStockPlayCount: Int,
    val skipTicketSpendPlayCount: Int,
    val tenTimesSpendPlayCount: Int,
    val startDashStockCount: Int
)