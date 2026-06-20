package ap.eventplanner.api.discord.infrastructure.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.context.HttpSessionSecurityContextRepository
import org.springframework.security.web.context.SecurityContextRepository

@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .authorizeHttpRequests { auth ->
                auth
                    .requestMatchers("/discord/**", "/css/**", "/js/**").permitAll()
                    .anyRequest().authenticated()
            }
            .formLogin { it.disable() } // デフォルトログイン使わない
            .exceptionHandling {
                // 未認証or認証切れ時はログイン画面へリダイレクトせず、401のみ返す
                it.authenticationEntryPoint { _, response, _ ->
                    response.sendError(401)
                }
            }
            .logout { logout ->
                logout
                    .logoutUrl("/logout")
                    .logoutSuccessUrl("/discord/login")
            }

        return http.build()
    }

    @Bean
    fun securityContextRepository(): SecurityContextRepository =
        HttpSessionSecurityContextRepository()
}