FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN maven clean package -DskipTests



FROM eclipse-temurin:25-jre
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring
ARG JAR_FILE=target/*.jar
COPY {JAR_FILE} app.jar
CMD ["java", "-jar", "app.jar"]
