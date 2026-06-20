package ap.eventplanner.api.discord.application

import ap.eventplanner.api.DiscordProperties
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.context.SecurityContextRepository
import org.springframework.stereotype.Service
import java.net.URI

@Service
class LoginOAuthService(
    private val oAuthClient: OAuthClient,
    private val discordProperties: DiscordProperties,
    private val securityContextRepository: SecurityContextRepository
) {

    fun createLoginRedirectUri(): URI {
        return oAuthClient.createAuthorizationUri()
    }

    fun authenticate(
        code: String,
        request: HttpServletRequest,
        response: HttpServletResponse
    ) {
        val token = oAuthClient.exchangeCodeForToken(code)

        val userId = oAuthClient.fetchUser(token)
        val role = oAuthClient.fetchGuilds(token)
            .filter { it in discordProperties.targetGuildIds }
            .firstNotNullOfOrNull { guildId ->
                oAuthClient.fetchRoles(guildId, userId)
                    .firstOrNull { it in discordProperties.targetRoleIds }
            }
            ?: throw RoleAccessDeniedException()

        val auth = UsernamePasswordAuthenticationToken(
            userId,
            null,
            listOf(SimpleGrantedAuthority(role))
        )
        val context = SecurityContextHolder.createEmptyContext()
        context.authentication = auth
        SecurityContextHolder.setContext(context)
        securityContextRepository.saveContext(context, request, response)
    }
}

class RoleAccessDeniedException(
    message: String = "アクセス権がありません",
    cause: Throwable? = null
) : RuntimeException(message, cause)