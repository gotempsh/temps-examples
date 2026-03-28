package com.example.contacts.config;

import com.example.contacts.model.Contact;
import com.example.contacts.repository.ContactRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ContactRepository repository;

    public DataSeeder(ContactRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) return;

        Contact alice = new Contact();
        alice.setFirstName("Alice");
        alice.setLastName("Johnson");
        alice.setEmail("alice@example.com");
        alice.setPhone("+1-555-0101");
        alice.setCompany("Acme Corp");
        alice.setRole("CTO");
        alice.setNotes("Met at KubeCon 2025");
        repository.save(alice);

        Contact bob = new Contact();
        bob.setFirstName("Bob");
        bob.setLastName("Smith");
        bob.setEmail("bob@example.com");
        bob.setPhone("+1-555-0102");
        bob.setCompany("Acme Corp");
        bob.setRole("Senior Engineer");
        repository.save(bob);

        Contact carol = new Contact();
        carol.setFirstName("Carol");
        carol.setLastName("Williams");
        carol.setEmail("carol@example.com");
        carol.setPhone("+1-555-0103");
        carol.setCompany("Startup Inc");
        carol.setRole("Founder");
        carol.setNotes("Interested in partnership");
        repository.save(carol);
    }
}
