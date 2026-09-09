package ap.eventplanner.api.discord.infrastructure

import ap.eventplanner.api.DiscordBotAuthProperties
import ap.eventplanner.api.DiscordProperties
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpHeaders
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.nio.charset.StandardCharsets
import java.security.MessageDigest


@Component
class DiscordBotAuthenticationFilter(
    private val discordProperties: DiscordProperties,
    private val discordBotAuthProperties: DiscordBotAuthProperties
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        /**
         * Authorization: Bearer test
         * X-Discord-User-Id: 123456789012345678
         * X-Discord-Role: 1234567890123456789,1234567890123456789, ...
         * Content-Type: application/json
         * */
        val authorization = request.getHeader(HttpHeaders.AUTHORIZATION)
        // Bearerがなければ当filterは終了(次のfilterに進める)
        if (authorization?.startsWith(BEARER_PREFIX, ignoreCase = true) != true) {
            filterChain.doFilter(request, response)
            return
        }
        val token = authorization.substring(BEARER_PREFIX.length).trim()
        val userId = request.getHeader(USER_ID_HEADER)?.takeIf { it.isNotBlank() }
        val roles = request.getHeader(ROLE_HEADER)
            ?.takeIf { it.isNotBlank() } // "111,222,333"
            ?.split(",") // ["111 ", " 222", " 333"]
            ?.map { it.trim() } // 空白除去->["111", "222", "333"]
            ?.filter { it in discordProperties.targetRoleIds }
            ?.distinct()
            ?: emptyList()
        val authorities = roles.map { SimpleGrantedAuthority(it) }
        val tokenMatches = MessageDigest.isEqual(
            discordBotAuthProperties.token.toByteArray(StandardCharsets.UTF_8),
            token.toByteArray(StandardCharsets.UTF_8)
        )

        if (!tokenMatches || userId == null) {
            SecurityContextHolder.clearContext()
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED)
            return
        }

        val context = SecurityContextHolder.createEmptyContext()
        context.authentication = UsernamePasswordAuthenticationToken(
            userId,
            null,
            authorities
        )
        SecurityContextHolder.setContext(context)

        filterChain.doFilter(request, response)
    }

    companion object {
        const val USER_ID_HEADER = "X-Discord-User-Id"
        const val ROLE_HEADER = "X-Discord-Role"
        private const val BEARER_PREFIX = "Bearer "
    }
}
