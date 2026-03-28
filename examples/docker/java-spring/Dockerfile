FROM gradle:8.14-jdk21-alpine AS builder
WORKDIR /app

COPY build.gradle.kts settings.gradle.kts ./
RUN gradle dependencies --no-daemon

COPY src ./src
RUN gradle bootJar --no-daemon

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/build/libs/*.jar app.jar

USER appuser
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
