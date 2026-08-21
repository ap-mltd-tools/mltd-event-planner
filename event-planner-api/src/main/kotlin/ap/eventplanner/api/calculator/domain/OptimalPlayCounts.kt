package ap.eventplanner.api.calculator.domain

/** 最適貯め・吐き回数 */
data class OptimalPlayCounts(
    val stockPlayCount: Int,
    val spendPlayCount: Int,
) {
    init {
        require(stockPlayCount >= 0)
        require(spendPlayCount >= 0)
    }
}