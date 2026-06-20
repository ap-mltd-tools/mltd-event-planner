package ap.eventplanner.api.calculator.domain

data class OptimalPlayCounts(
    val stockPlayCount: Int,
    val spendPlayCount: Int,
) {
    init {
        require(stockPlayCount >= 0)
        require(spendPlayCount >= 0)
    }
}