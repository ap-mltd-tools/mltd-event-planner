package ap.eventplanner.api.discord.infrastructure

import ap.eventplanner.api.DiscordProperties
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.web.servlet.FilterRegistrationBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.oauth2.client.registration.ClientRegistration
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository
import org.springframework.security.oauth2.core.AuthorizationGrantType
import org.springframework.security.oauth2.core.ClientAuthenticationMethod
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.logout.LogoutFilter
import org.springframework.security.web.context.HttpSessionSecurityContextRepository
import org.springframework.security.web.context.SecurityContextRepository
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
@EnableWebSecurity
class SecurityConfig (
    private val discordProperties: DiscordProperties
){
    @Value("\${base-url}")
    lateinit var baseUrl: String

    @Bean
    fun securityFilterChain(
        http: HttpSecurity,
        discordBotAuthenticationFilter: DiscordBotAuthenticationFilter,
        discordOAuth2UserService: DiscordOAuth2UserService
    ): SecurityFilterChain {
        http
            // 単一Originに完全移行するならば削除
            .cors {  }
            .csrf { it.disable() }
            .oauth2Login {
                it.userInfoEndpoint { userInfo ->
                    userInfo.userService(discordOAuth2UserService)
                }
                it.defaultSuccessUrl(baseUrl, true)
            }
            .addFilterAfter(
                discordBotAuthenticationFilter,
                LogoutFilter::class.java
            )
            .authorizeHttpRequests {
                it
                    .requestMatchers("/oauth2/**", "/login/oauth2/**", "/css/**", "/js/**")
                    .permitAll()
                    .anyRequest()
                    .hasAnyAuthority(*discordProperties.targetRoleIds.toTypedArray())
            }
            // デフォルトログイン使わない
            .formLogin { it.disable() }
            .exceptionHandling {
                it
                    // 未認証or認証切れ時はログイン画面へリダイレクトせず、401のみ返す
                    .authenticationEntryPoint { _, response, _ ->
                    response.status = HttpServletResponse.SC_UNAUTHORIZED }
                    // 認可失敗の場合は、403を返す
                    .accessDeniedHandler { _, response, _ ->
                        response.status = HttpServletResponse.SC_FORBIDDEN }
            }
            .logout { logout ->
                logout
                    .logoutUrl("/logout")
                    .logoutSuccessUrl(baseUrl)
            }

        return http.build()
    }

    @Bean
    fun securityContextRepository(): SecurityContextRepository =
        HttpSessionSecurityContextRepository()

    // 単一Originに完全移行するならば削除
    @Bean
    fun corsConfigurationSource(): UrlBasedCorsConfigurationSource {
        val configuration = CorsConfiguration().apply {
            allowedOrigins = listOf(baseUrl)
            allowedMethods = listOf("GET", "POST", "OPTIONS")
            allowedHeaders = listOf("*")
            allowCredentials = true
        }

        return UrlBasedCorsConfigurationSource().apply {
            registerCorsConfiguration("/**", configuration)
        }
    }

    @Bean
    fun clientRegistrationRepository(): ClientRegistrationRepository {
        return InMemoryClientRegistrationRepository(discordClientRegistration())
    }

    private fun discordClientRegistration(): ClientRegistration {
        return ClientRegistration.withRegistrationId("discord")
            .clientId(discordProperties.clientId)
            .clientSecret(discordProperties.clientSecret)
            .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
            .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
            .redirectUri("{baseUrl}/login/oauth2/code/{registrationId}") // Discord Developer Portal側にも登録する
            .scope("identify", "guilds")
            .authorizationUri("https://discord.com/api/oauth2/authorize")
            .tokenUri("https://discord.com/api/oauth2/token")
            .userInfoUri("https://discord.com/api/users/@me")
            .userNameAttributeName("id")
            .clientName("Discord")
            .build()
    }

    // Filter2回実行を避けるため、Servlet Containerへの自動登録を無効化
    @Bean
    fun discordBotAuthenticationFilterRegistration(filter: DiscordBotAuthenticationFilter)
    : FilterRegistrationBean<DiscordBotAuthenticationFilter> {
        val registration = FilterRegistrationBean(filter)
        registration.isEnabled = false
        return registration
    }
}
