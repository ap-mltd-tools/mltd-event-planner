package ap.eventplanner.api.calculator.application

/** 貯め吐き回数最適化計算用データ */
data class PlayCountCalculationInput(
    /** 1時間当たりの貯め回数 */
    val stockPlaysPerHour: Double,
    /** 1時間当たりの吐き回数 */
    val spendPlaysPerHour: Double,
    /** 総使用可能時間 */
    val operatingSeconds: Int,
    /** スタダにかかる時間 */
    val startDashSecondsPerLap: Int,
    /** スキチケ使用時間 */
    val skipTicketsSecondsPerPlay: Int,
    /** 選曲画面→楽曲開始の遷移にかかる時間 */
    val songStartTransitionSeconds: Int,
    /** スタダ回数 */
    val startDashPlayCount: Int,
    /** スキチケ使用枚数 */
    val skipTicketPlayCount: Int,
    /** 10倍吐き回数 */
    val tenTimesSpendPlayCount: Int,
    /** 選曲画面→楽曲開始の遷移を行う回数 */
    val songStartTransitionCount: Int,
    /** デイリー追加トリガー */
    val dailyAddedTriggers: Int,
    /** 計算開始時点の所持トリガー */
    val initialTriggers: Int,
    /** 目標残りトリガー */
    val targetRemainingTriggers: Int,
    /** スキチケ貯めに使うか吐きに使うか */
    val skipTicketUsage: SkipTicketUsage
)

enum class SkipTicketUsage {
    STOCK,
    SPEND
}
