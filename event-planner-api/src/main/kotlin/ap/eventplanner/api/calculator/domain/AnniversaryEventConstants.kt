package ap.eventplanner.api.calculator.domain

object AnniversaryEventConstants {
    /** チケット450枚消費時の獲得ポイント */
    const val STOCK_GAIN_PER_PLAY = 1071
    /** 4倍プレイ時の消化トリガー量 */
    const val SPEND_LOSS_PER_PLAY = 720
    /** 10倍プレイ時に4倍プレイより追加で消費するトリガー量 */
    const val TEN_TIMES_PLAY_ADDITIONAL_POINT = 1080
    /** スタダで行う曲数 */
    const val START_DASH_PLAYED_MUSIC_COUNT = 4
}