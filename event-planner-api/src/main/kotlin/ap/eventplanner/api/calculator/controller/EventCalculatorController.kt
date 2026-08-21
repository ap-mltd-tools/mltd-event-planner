package ap.eventplanner.api.calculator.controller

import ap.eventplanner.api.calculator.application.PlayCountCalculationInput
import ap.eventplanner.api.calculator.application.PlayCountCalculationService
import ap.eventplanner.api.calculator.application.PlayPlanResult
import org.springframework.http.ResponseEntity
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
}