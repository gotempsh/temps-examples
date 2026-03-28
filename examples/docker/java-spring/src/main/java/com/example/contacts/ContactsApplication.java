package com.example.contacts;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class ContactsApplication {
    public static void main(String[] args) {
        SpringApplication.run(ContactsApplication.class, args);
    }
}
