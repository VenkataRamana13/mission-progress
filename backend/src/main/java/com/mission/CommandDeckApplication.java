package com.mission;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.beans.factory.annotation.Value;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
public class CommandDeckApplication {
    private static final Logger logger = LoggerFactory.getLogger(CommandDeckApplication.class);
    
    @Value("${spring.datasource.url}")
    private String dbUrl;

    public static void main(String[] args) {
        SpringApplication.run(CommandDeckApplication.class, args);
    }

    @PostConstruct
    public void logStartupInfo() {
        logger.info("=== CommandDeck Backend Starting ===");
        logger.info("Database URL: " + dbUrl);
        logger.info("User Home: " + System.getProperty("user.home"));
        logger.info("Working Directory: " + System.getProperty("user.dir"));
        logger.info("=== Environment Variables ===");
        System.getenv().forEach((key, value) -> {
            if (key.toLowerCase().contains("home") || key.toLowerCase().contains("path")) {
                logger.info(key + ": " + value);
            }
        });
        logger.info("================================");
    }
} 