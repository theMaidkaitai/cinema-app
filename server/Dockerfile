FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests


FROM eclipse-temurin:25-jre
RUN addgroup spring && adduser -D -G spring spring
USER spring:spring
ARG JAR_FILE=target/*.jar
COPY --from=build /app/target/*.jar app.jar 
CMD ["java", "-jar", "app.jar"]
