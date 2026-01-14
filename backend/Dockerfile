# Multi-stage build for optimized production image
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /build

# Copy dependency definitions
COPY pom.xml .

# Download dependencies (cached layer)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build application
RUN mvn clean package -DskipTests -B

# Production stage
FROM eclipse-temurin:21-jre-alpine

LABEL maintainer="Kishan Mitra Team"
LABEL description="AI-powered farmer assistance platform backend service"
LABEL version="1.0.0"

# Create non-root user for security
RUN addgroup -g 1001 -S appuser && \
    adduser -u 1001 -S appuser -G appuser

WORKDIR /app

# Copy built artifact from builder stage
COPY --from=builder /build/target/*.jar app.jar

# Create directory for logs
RUN mkdir -p /app/logs && chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Expose application port
EXPOSE 8080

# JVM optimization flags
ENV JAVA_OPTS="-XX:+UseContainerSupport \
    -XX:MaxRAMPercentage=75.0 \
    -XX:InitialRAMPercentage=50.0 \
    -XX:+UseG1GC \
    -XX:+UseStringDeduplication \
    -Djava.security.egd=file:/dev/./urandom"

# Run application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
