package ap.eventplanner.api.discord.infrastructure

import ap.eventplanner.api.DiscordProperties
import ap.eventplanner.api.discord.application.OAuthClient
import com.fasterxml.jackson.annotation.JsonProperty
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.BodyInserters
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.util.UriComponentsBuilder
import java.net.URI

@Component
class DiscordOAuthClient(
    private val discordProperties: DiscordProperties
): OAuthClient {

    private val tokenUri = URI.create("https://discord.com/api/oauth2/token")
    private val webClient = WebClient.create()

    override fun createAuthorizationUri(): URI {
        return UriComponentsBuilder
            .fromUriString("https://discord.com/api/oauth2/authorize")
            .queryParam("client_id", discordProperties.clientId)
            .queryParam("response_type", "code")
            .queryParam("redirect_uri", discordProperties.redirectUri)
            .queryParam("scope", "identify guilds")
            .build()
            .toUri()
    }

    override fun exchangeCodeForToken(code: String): String {
        val tokenResponse = webClient
            .post()
            .uri(tokenUri)
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .body(
                BodyInserters.fromFormData("client_id", discordProperties.clientId)
                    .with("client_secret", discordProperties.clientSecret)
                    .with("grant_type", "authorization_code")
                    .with("code", code)
                    .with("redirect_uri", discordProperties.redirectUri)
            )
            .retrieve()
            .bodyToMono(DiscordTokenResponse::class.java)
            .block() ?: throw DiscordApiException("Discord token response is null")

        return tokenResponse.accessToken
    }

    override fun fetchUser(accessToken: String): String {
        val user = webClient
            .get()
            .uri("https://discord.com/api/users/@me")
            .header(
                HttpHeaders.AUTHORIZATION,
                "Bearer $accessToken"
            )
            .retrieve()
            .bodyToMono(DiscordUser::class.java)
            .block() ?: throw DiscordApiException("Failed to fetch user")

        return user.id
    }

    override fun fetchGuilds(accessToken: String): List<String> {
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

    override fun fetchRoles(guildId: String, userId: String): List<String> {
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

data class DiscordTokenResponse(
    @JsonProperty("access_token")
    val accessToken: String,
    @JsonProperty("token_type")
    val tokenType: String,
    @JsonProperty("expires_in")
    val expiresIn: Int,
    @JsonProperty("refresh_token")
    val refreshToken: String? = null,

    val scope: String
)

data class DiscordUser(
    val id: String,
    val username: String
)

data class DiscordGuild(
    val id: String,
    val name: String,
    val permissions: String,
    val owner: Boolean
)

data class DiscordMember(
    val roles: List<String>
)

class DiscordApiException(
    message: String,
    cause: Throwable? = null
) : RuntimeException(message, cause)