export const ja = {
  translation: {
    header: {
      title: "ミリシタ周年イベント支援",
    },

    dashboard: {
      home: "ホーム",
      stockAndSpendPlayCalculator: "貯め吐き稼働計算",
    },

    auth: {
      discordLogin: "Discord認証",
    },

    home: {
      title: "ホーム",
      description: "ミリシタ周年イベントの支援ツールを提供します。",
      contactTitle: "連絡先",
      contactLink: {
        twitter: "X(旧Twitter)"
      }
    },

    calculate: {
      title: "貯め吐き稼働計算",

      labels: {
        stockPlaysPerHour: "1時間あたりの貯め回数",
        spendPlaysPerHour: "1時間あたりの吐き回数",
        operatingTime: "総使用可能時間",
        startDashCount: "スタダ回数",
        startDashTime: "スタダにかかる時間(一周当たり)",
        skipTicketCount: "スキチケ使用枚数",
        skipTicketsTime: "スキチケを使用する曲の秒数",
        tenTimesCount: "10倍使用回数",
        dailyTrigger: "デイリー追加トリガー",
        initialTrigger: "初期所持トリガー",
        targetRemainingTrigger: "目標残りトリガー",
        songStartTransitionCount: "選曲画面→イベント楽曲開始の遷移を行う回数",
        songStartTransitionSecond: "選曲画面→イベント楽曲開始の遷移にかかる時間",
      },

      descriptions: {
        stockPlaysPerHour: "",
        spendPlaysPerHour: "",
        operatingTime: "",
        startDashCount: "リフレ中に貯めたチケットの消費を行う回数",
        startDashTime: "リフレ中に貯めたチケットを消費しきるのにかかる時間",
        skipTicketCount: "",
        skipTicketsTime: "曲自体の秒数",
        tenTimesCount: "",
        dailyTrigger: "おすすめ楽曲+ログインボーナス(1日あたり4540個)",
        initialTrigger: "",
        targetRemainingTrigger: "",
        songStartTransitionCount: "初回イベント楽曲スタート、10倍使用時、スキチケ使用時...\nまた、BOXからオーパス回収する場合やブースト使用でイベントTOPに戻る場合は2回分換算でカウントするのがおすすめです",
        songStartTransitionSecond: "",
      },

      options: {
        useForSpend: "吐きに使う",
        useForStock: "貯めに使う",
      },

      actions: {
        calculate: "計算する",
      },

      loading: "計算中・・・",

      result: {
        title: "計算結果",
        stockPlayCount:
          "貯め回数：{{count}} 回 (内 スキチケ：{{skip}} 回)",
        spendPlayCount:
          "吐き回数：{{count}} 回 (内 スキチケ：{{skip}} 回 ＆ 10倍吐き：{{ten}} 回)",
        stockSeconds:
          "貯め時間：{{h}}時間 {{m}}分 {{s}}秒",
        spendSeconds:
          "吐き時間：{{h}}時間 {{m}}分 {{s}}秒",
        startDashSeconds:
          "スタダ時間：{{h}}時間 {{m}}分 {{s}}秒(貯め{{count}}回分)",
        songStartTransitionSeconds:
          "選曲画面→イベント楽曲開始の遷移に使う時間：{{h}}時間 {{m}}分 {{s}}秒",
        remainingSeconds:
          "残り時間：{{sign}}{{h}}時間 {{m}}分 {{s}}秒",
        remainingTriggers:
          "残りトリガー：{{count}}個",
      },
    },

    common: {
      time: {
        hour: "時間",
        minute: "分",
        second: "秒",
      },
    },
  },
}