package ap.eventplanner.api.calculator.application

import ap.eventplanner.api.calculator.domain.OptimalPlayCounts
import org.springframework.stereotype.Component
import kotlin.math.abs
import kotlin.time.Duration

@Component
class OptimalPlayCountsCalculator() {
    private val stockGainPerPlay = AnniversaryEventConstants.STOCK_GAIN_PER_PLAY
    private val spendLossPerPlay = AnniversaryEventConstants.SPEND_LOSS_PER_PLAY
    private val tenTimesPlayAdditionalPoint = AnniversaryEventConstants.TEN_TIMES_PLAY_ADDITIONAL_POINT
    private val startDashPlayedMusicCount = AnniversaryEventConstants.START_DASH_PLAYED_MUSIC_COUNT

    /** 貯め吐き稼働計算 */
    fun findOptimalPlayCounts(parameters: PlayCountCalculationParameters): OptimalPlayCounts {

        val specialOperationDuration: Duration =
            parameters.startDashDuration +
                    parameters.songStartTransitionDuration -
                    parameters.skipTicketsDuration
        val remainingDuration = parameters.operatingDuration -
                specialOperationDuration

        // 特殊操作時間が稼働時間を上回る場合、貯め吐きプレイ回数は0回とする
        if (remainingDuration.isNegative()) {
            return OptimalPlayCounts(0,0)
        }

        val maxSpendPlayCount =
            (remainingDuration /
                    parameters.spendDurationPerPlay)
                .toInt()
                .coerceAtLeast(0)

        var bestScore = Int.MAX_VALUE
        var bestPlayCounts = OptimalPlayCounts(0, 0)

        for (spendPlayCount in 0..maxSpendPlayCount) {

            val spendDurationTotal = parameters.spendDurationPerPlay * spendPlayCount

            val stockDurationTotal = remainingDuration - spendDurationTotal

            val stockPlayCount =
                (stockDurationTotal /
                        parameters.stockDurationPerPlay).toInt()

            val stockGain = stockPlayCount * stockGainPerPlay
            val spendLoss = spendPlayCount * spendLossPerPlay

            val score =
                stockGain -
                        spendLoss +
                        parameters.startDashPlayCount * startDashPlayedMusicCount * stockGainPerPlay +
                        parameters.dailyAddedTriggers -
                        parameters.tenTimesSpendPlayCount * tenTimesPlayAdditionalPoint +
                        parameters.initialTriggers

            if (score < parameters.targetRemainingTriggers) {
                continue
            }

            if (abs(score) < bestScore) {
                bestScore = abs(score)

                bestPlayCounts = OptimalPlayCounts(
                    stockPlayCount = stockPlayCount,
                    spendPlayCount = spendPlayCount,
                )
            }
        }
        return bestPlayCounts
    }
}