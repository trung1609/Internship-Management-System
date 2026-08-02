package com.trung;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class IntershipManagementSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(IntershipManagementSystemApplication.class, args);
	}

}
