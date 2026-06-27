package ap.eventplanner.api.calculator.application

import ap.eventplanner.api.calculator.domain.OptimalPlayCounts
import org.springframework.stereotype.Service
import kotlin.time.Duration
import kotlin.time.Duration.Companion.seconds

@Service
class PlayCountCalculationService(
    private val optimalPlayCountsCalculator: OptimalPlayCountsCalculator,
    private val playOutcomeSimulator: PlayOutcomeSimulator
) {
    fun calculatePlayPlan(input: PlayCountCalculationInput): PlayPlanResult {
        val parameters = input.toParameters()
        val optimalPlayCounts : OptimalPlayCounts = optimalPlayCountsCalculator
            .findOptimalPlayCounts(parameters)
        val operatingTime: OptimalOperatingTime = playOutcomeSimulator
            .calculateOperatingTime(optimalPlayCounts, parameters)
        val remainingTriggers: Int = playOutcomeSimulator
            .calculateRemainingTriggers(optimalPlayCounts, parameters)
        val remainingSeconds: Duration = playOutcomeSimulator
            .calculateRemainingSeconds(operatingTime, parameters)

        return PlayPlanResult(
            stockPlayCount = optimalPlayCounts.stockPlayCount,
            spendPlayCount = optimalPlayCounts.spendPlayCount,
            stockSeconds = operatingTime.stockDuration.inWholeSeconds.toInt(),
            spendSeconds = operatingTime.spendDuration.inWholeSeconds.toInt(),
            startDashSeconds = parameters.startDashDuration.inWholeSeconds.toInt(),
            songStartTransitionSeconds = parameters.songStartTransitionDuration.inWholeSeconds.toInt(),
            remainingTriggers = remainingTriggers,
            remainingSeconds = remainingSeconds.inWholeSeconds.toInt(),
            skipTicketStockPlayCount = if (parameters.skipTicketUsage == SkipTicketUsage.STOCK)
                parameters.skipTicketPlayCount else 0,
            skipTicketSpendPlayCount = if (parameters.skipTicketUsage == SkipTicketUsage.SPEND)
                parameters.skipTicketPlayCount else 0,
            tenTimesSpendPlayCount = parameters.tenTimesSpendPlayCount,
            startDashStockCount = parameters.startDashPlayCount * AnniversaryEventConstants.START_DASH_PLAYED_MUSIC_COUNT
        )
    }

    private fun PlayCountCalculationInput.toParameters(): PlayCountCalculationParameters {
        val secondsPerHour = 3600.0
        return PlayCountCalculationParameters(
            stockDurationPerPlay = (secondsPerHour / stockPlaysPerHour).seconds,
            spendDurationPerPlay = (secondsPerHour / spendPlaysPerHour).seconds,
            operatingDuration = operatingSeconds.seconds,
            startDashDuration = (startDashSecondsPerLap * startDashPlayCount).seconds,
            skipTicketsDuration = (skipTicketsSecondsPerPlay * skipTicketPlayCount).seconds,
            songStartTransitionDuration = (songStartTransitionSeconds * songStartTransitionCount).seconds,

            startDashPlayCount = startDashPlayCount,
            skipTicketPlayCount = skipTicketPlayCount,
            tenTimesSpendPlayCount = tenTimesSpendPlayCount,

            dailyAddedTriggers = dailyAddedTriggers,
            initialTriggers = initialTriggers,
            targetRemainingTriggers = targetRemainingTriggers,
            skipTicketUsage = skipTicketUsage
        )
    }
}

data class PlayCountCalculationParameters(
    val stockDurationPerPlay: Duration,
    val spendDurationPerPlay: Duration,
    val operatingDuration: Duration,
    val startDashDuration: Duration,
    val skipTicketsDuration: Duration,
    val songStartTransitionDuration: Duration,
    val startDashPlayCount: Int,
    val skipTicketPlayCount: Int,
    val tenTimesSpendPlayCount: Int,
    val dailyAddedTriggers: Int,
    val initialTriggers: Int,
    val targetRemainingTriggers: Int,
    val skipTicketUsage: SkipTicketUsage
)