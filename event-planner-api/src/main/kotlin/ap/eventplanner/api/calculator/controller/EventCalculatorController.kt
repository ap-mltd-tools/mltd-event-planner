package ap.eventplanner.api.calculator.controller

import ap.eventplanner.api.calculator.application.PlayCountCalculationInput
import ap.eventplanner.api.calculator.application.PlayCountCalculationService
import ap.eventplanner.api.calculator.application.PlayPlanResult
import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class EventCalculatorController(
    private val calculationService: PlayCountCalculationService
) {

    @PostMapping("/calculate")
    fun calculate(
        @RequestBody input: PlayCountCalculationInput
    ): ResponseEntity<PlayPlanResult> {
        val result = calculationService.calculatePlayPlan(input)
        return ResponseEntity.ok(result)
    }

    @GetMapping("/debug")
    fun debug(request: HttpServletRequest): ResponseEntity<String> {
        val session = request.getSession(false)
        return ResponseEntity.ok(        """
        sessionId = ${session.id}
        creationTime = ${session.creationTime}
        lastAccessedTime = ${session.lastAccessedTime}
        maxInactiveInterval(sec) = ${session.maxInactiveInterval}
        """.trimIndent())
    }
}