export const en = {
  translation: {
    header: {
      title: "Million Live! Theater Days Anniversary Event Support",
    },

    dashboard: {
      home: "Home",
      stockAndSpendPlayCalculator: "Stock & Spend Calculator",
    },

    auth: {
      discordLogin: "Discord Login",
    },

    home: {
      title: "Home",
      description: "A support tool for the Theater Days Anniversary Event.",
    contactTitle: "Contact",
      contactLink: {
        twitter: "X (formerly Twitter)"
      }
    },

    calculate: {
      title: "Stock & Spend Play Calculator",

      labels: {
        stockPlaysPerHour: "Stock Plays per Hour",
        spendPlaysPerHour: "Spend Plays per Hour",
        operatingTime: "Total Available Time",
        startDashCount: "Start Dash Count",
        startDashTime: "Start Dash Duration (per Run)",
        skipTicketCount: "Skip Ticket Count",
        skipTicketsTime: "Song Duration for Skip Tickets",
        tenTimesCount: "10× Play Count",
        dailyTrigger: "Daily Bonus Triggers",
        initialTrigger: "Initial Triggers",
        targetRemainingTrigger: "Target Remaining Triggers",
        songStartTransitionCount:
          "Song Selection → Event Song Start Transition Count",
        songStartTransitionSecond:
          "Song Selection → Event Song Start Transition Duration",
      },

      descriptions: {
        stockPlaysPerHour: "",
        spendPlaysPerHour: "",
        operatingTime: "",
        startDashCount: "Number of times to spend the tickets accumulated during the refresh period.",
        startDashTime: "Time required to use all tickets accumulated during the refresh period.",
        skipTicketCount: "",
        skipTicketsTime: "Duration of the song itself.",
        tenTimesCount: "",
        dailyTrigger: "Recommended Song + Daily Login Bonus (4,540 triggers per day).",
        initialTrigger: "",
        targetRemainingTrigger: "",
        songStartTransitionCount: "Count one transition for the first event song start, using 10x play, or using Skip Tickets.\nIf you collect an Auto Play Pass from the BOX or return to the event screen after using a boost, it is recommended to count those as two transitions.",
        songStartTransitionSecond: "",
      },

      options: {
        useForSpend: "Use for Spend",
        useForStock: "Use for Stock",
      },

      actions: {
        calculate: "Calculate",
      },

      loading: "Calculating...",

      result: {
        title: "Calculation Result",
        stockPlayCount:
          "Stock Plays: {{count}} (Skip Tickets: {{skip}})",
        spendPlayCount:
          "Spend Plays: {{count}} (Skip Tickets: {{skip}}, ×10 Plays: {{ten}})",
        stockSeconds:
          "Stock Time: {{h}}h {{m}}m {{s}}s",
        spendSeconds:
          "Spend Time: {{h}}h {{m}}m {{s}}s",
        startDashSeconds:
          "Start Dash Time: {{h}}h {{m}}m {{s}}s (Equivalent to {{count}} stock plays)",
        songStartTransitionSeconds:
          "Transition time from song selection to event song start: {{h}}h {{m}}m {{s}}s",
        remainingSeconds:
          "Remaining Time: {{sign}}{{h}}h {{m}}m {{s}}s",
        remainingTriggers:
          "Remaining Triggers: {{count}}",
      },
    },

    common: {
      time: {
        hour: "h",
        minute: "m",
        second: "s",
      },
    },
  },
}