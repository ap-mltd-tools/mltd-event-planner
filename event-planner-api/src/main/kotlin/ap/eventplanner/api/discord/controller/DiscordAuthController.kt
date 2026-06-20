package ap.eventplanner.api.discord.controller

import ap.eventplanner.api.discord.application.LoginOAuthService
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/discord")
class DiscordAuthController(
    private val loginOAuthService: LoginOAuthService
) {
    @GetMapping("/login")
    fun login(): ResponseEntity<Void> {
        return ResponseEntity
            .status(HttpStatus.FOUND)
            .location(loginOAuthService.createLoginRedirectUri())
            .build()
    }

    @GetMapping("/callback")
    fun callback(
        @RequestParam code: String,
        request: HttpServletRequest,
        response: HttpServletResponse
    ) {
        loginOAuthService.authenticate(code, request, response)
        response.sendRedirect("/")
    }

    @GetMapping("/status")
    fun status(
        authentication: Authentication?
    ): ResponseEntity<Any> {

        if (authentication == null) {
            return ResponseEntity
                .status(401)
                .build()
        }

        return ResponseEntity.ok(
            mapOf(
                "authenticated" to true,
                "userId" to authentication.name
            )
        )
    }
}