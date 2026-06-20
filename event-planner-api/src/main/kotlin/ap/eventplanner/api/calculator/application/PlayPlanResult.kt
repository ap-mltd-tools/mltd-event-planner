package ap.eventplanner.api.calculator.application

/** 貯め吐き回数最適化結果 */
data class PlayPlanResult (
    val stockPlayCount: Int,
    val spendPlayCount: Int,
    val stockSeconds: Int,
    val spendSeconds: Int,
    val startDashSeconds: Int,
    val remainingTriggers: Int,
    val remainingSeconds: Int,
    val skipTicketStockPlayCount: Int,
    val skipTicketSpendPlayCount: Int,
    val tenTimesSpendPlayCount: Int,
    val startDashStockCount: Int
)