package ap.eventplanner.api

import jakarta.validation.constraints.NotBlank
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.boot.runApplication
import org.springframework.validation.annotation.Validated


@SpringBootApplication
@ConfigurationPropertiesScan
class EventPlannerApiApplication

fun main(args: Array<String>) {
	runApplication<EventPlannerApiApplication>(*args)
}

@ConfigurationProperties(prefix = "discord")
data class DiscordProperties(
	val clientId: String,
	val clientSecret: String,
	val botToken: String,
	val redirectUri: String,
	val targetGuildIds: List<String>,
	val targetRoleIds: List<String>
)

@Validated
@ConfigurationProperties(prefix = "discord-bot-auth")
data class DiscordBotAuthProperties(
	@NotBlank
	val token: String
)