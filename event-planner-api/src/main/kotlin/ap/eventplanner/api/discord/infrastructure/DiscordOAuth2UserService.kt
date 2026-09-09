package ap.eventplanner.api.discord.infrastructure

import ap.eventplanner.api.DiscordProperties
import org.springframework.http.HttpHeaders
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService
import org.springframework.security.oauth2.core.user.DefaultOAuth2User
import org.springframework.security.oauth2.core.user.OAuth2User
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient

@Service
class DiscordOAuth2UserService(
    private val discordProperties: DiscordProperties
): OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private val delegate = DefaultOAuth2UserService()
    private val webClient = WebClient.create()

    override fun loadUser(userRequest: OAuth2UserRequest): OAuth2User {
        val oauth2User = delegate.loadUser(userRequest)
        val accessToken = userRequest.accessToken.tokenValue
        val userId = oauth2User.name
        val roles = fetchGuilds(accessToken)
            .filter { it in discordProperties.targetGuildIds }
            .flatMap { guildId ->
                fetchRoles(guildId, userId)
                    .filter { it in discordProperties.targetRoleIds }
            }
            .distinct()
        val authorities = roles.map { SimpleGrantedAuthority(it) }

        return DefaultOAuth2User(
            authorities,
            oauth2User.attributes,
            "id"
        )
    }

    private fun fetchGuilds(accessToken: String): List<String> {
        return webClient
            .get()
            .uri("https://discord.com/api/users/@me/guilds")
            .header(HttpHeaders.AUTHORIZATION, "Bearer $accessToken")
            .retrieve()
            .bodyToMono(object : org.springframework.core.ParameterizedTypeReference<List<DiscordGuild>>() {})
            .block()
            ?.map { it.id }
            ?: emptyList()
    }

    private fun fetchRoles(guildId: String, userId: String): List<String> {
        return webClient.get()
            .uri(
                "https://discord.com/api/guilds/{guildId}/members/{userId}",
                guildId,
                userId
            )
            .header(
                HttpHeaders.AUTHORIZATION,
                "Bot ${discordProperties.botToken}"
            )
            .retrieve()
            .bodyToMono(DiscordMember::class.java)
            .block()
            ?.roles
            ?: emptyList()
    }
}