package ap.eventplanner.api.calculator.domain

import kotlin.time.Duration

/** 貯め・吐き回数最適化計算用パラメータ */
data class PlayCountCalculationParameters(
    /** 貯め1回辺りにかかる時間 */
    val stockDurationPerPlay: Duration,
    /** 吐き1回辺りにかかる時間 */
    val spendDurationPerPlay: Duration,
    /** 総使用可能時間 */
    val operatingDuration: Duration,
    /** スタダにかかる合計時間 */
    val startDashDuration: Duration,
    /** スキップしなければ本来追加でかかっていた時間 */
    val skippedPlayDuration: Duration,
    /** 選曲画面から楽曲開始までの遷移にかかった合計時間 */
    val songStartTransitionDuration: Duration,
    /** スタダを行った回数 */
    val startDashPlayCount: Int,
    /** スキチケを使用した枚数 */
    val skipTicketPlayCount: Int,
    /** 10倍吐きを行った回数 */
    val tenTimesSpendPlayCount: Int,
    /** おすすめ楽曲+ログインボーナスで貰えるトリガーの合計量 */
    val dailyAddedTriggers: Int,
    /** 計算開始時点の所持トリガー量 */
    val initialTriggers: Int,
    /** 目標とする残りトリガー量 */
    val targetRemainingTriggers: Int,
    /** スキチケ貯めに使うか吐きに使うか */
    val skipTicketUsage: SkipTicketUsage
)

enum class SkipTicketUsage {
    STOCK,
    SPEND
}