package ap.eventplanner.api.discord.application

import java.net.URI

interface OAuthClient {
    fun createAuthorizationUri(): URI

    fun exchangeCodeForToken(code: String): String
    fun fetchUser(accessToken: String): String
    fun fetchGuilds(accessToken: String): List<String>

    fun fetchRoles(guildId: String, userId: String): List<String>
}