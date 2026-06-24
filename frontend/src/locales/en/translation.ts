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