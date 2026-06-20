package ap.eventplanner.api.calculator.application

import ap.eventplanner.api.calculator.domain.OptimalPlayCounts
import org.springframework.stereotype.Component
import kotlin.time.Duration
import kotlin.time.times

data class OptimalOperatingTime (
    val stockDuration: Duration,
    val spendDuration: Duration,
)

@Component
class PlayOutcomeSimulator() {
    private val stockGainPerPlay = AnniversaryEventConstants.STOCK_GAIN_PER_PLAY
    private val spendLossPerPlay = AnniversaryEventConstants.SPEND_LOSS_PER_PLAY
    private val tenTimesPlayAdditionalPoint = AnniversaryEventConstants.TEN_TIMES_PLAY_ADDITIONAL_POINT
    private val startDashPlayedMusicCount = AnniversaryEventConstants.START_DASH_PLAYED_MUSIC_COUNT

    /** 稼働時間計算 */
    fun calculateOperatingTime(
        optimalPlayCounts: OptimalPlayCounts,
        parameters: PlayCountCalculationParameters
    ): OptimalOperatingTime {
        return when (parameters.skipTicketUsage) {
            SkipTicketUsage.STOCK ->
                OptimalOperatingTime(
                    optimalPlayCounts.stockPlayCount *
                            parameters.stockDurationPerPlay -
                            parameters.skipTicketsDuration,
                    optimalPlayCounts.spendPlayCount *
                            parameters.spendDurationPerPlay
                )
            SkipTicketUsage.SPEND ->
                OptimalOperatingTime(
                    optimalPlayCounts.stockPlayCount *
                            parameters.stockDurationPerPlay,
                    optimalPlayCounts.spendPlayCount *
                            parameters.spendDurationPerPlay -
                            parameters.skipTicketsDuration
                )
        }
    }
    /** トリガー残数計算 */
    fun calculateRemainingTriggers(
        optimalPlayCounts: OptimalPlayCounts,
        parameters: PlayCountCalculationParameters
    ): Int {
        val stockGain = optimalPlayCounts.stockPlayCount * stockGainPerPlay
        val spendLoss = optimalPlayCounts.spendPlayCount * spendLossPerPlay
        return stockGain -
                spendLoss +
                parameters.startDashPlayCount * startDashPlayedMusicCount * stockGainPerPlay +
                parameters.dailyAddedTriggers -
                parameters.tenTimesSpendPlayCount * tenTimesPlayAdditionalPoint +
                parameters.initialTriggers
    }
}