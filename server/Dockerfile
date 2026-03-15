#FROM maven:3.9-eclipse-temurin-25 AS build
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests


#FROM eclipse-temurin:25-jre-alpine
FROM eclipse-temurin:21-jre-alpine
RUN addgroup -S spring && adduser -S spring -G spring
RUN mkdir -p /uploads /app/uploads && chown -R spring:spring /uploads /app/uploads
USER spring:spring
ARG JAR_FILE=target/*.jar
COPY --from=build /app/target/*.jar app.jar 
CMD ["java", "-jar", "app.jar"]
