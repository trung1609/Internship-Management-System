package com.trung;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.TimeZone;

@SpringBootApplication
@EnableScheduling
public class IntershipManagementSystemApplication {
	@PostConstruct
	public void init(){
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
		System.out.println("Spring Boot application configured timezone: " + TimeZone.getDefault().getID());
	}
	public static void main(String[] args) {
		SpringApplication.run(IntershipManagementSystemApplication.class, args);
	}

}
