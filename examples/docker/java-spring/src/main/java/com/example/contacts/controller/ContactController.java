package com.example.contacts.controller;

import com.example.contacts.model.Contact;
import com.example.contacts.repository.ContactRepository;
import jakarta.validation.Valid;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/contacts")
@CrossOrigin
public class ContactController {

    private final ContactRepository repository;

    public ContactController(ContactRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    @Cacheable(value = "contacts", key = "'all'")
    public List<Contact> list() {
        return repository.findAll();
    }

    @GetMapping("/search")
    public List<Contact> search(@RequestParam String q) {
        return repository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(q, q);
    }

    @GetMapping("/company/{company}")
    public List<Contact> byCompany(@PathVariable String company) {
        return repository.findByCompanyIgnoreCase(company);
    }

    @GetMapping("/{id}")
    @Cacheable(value = "contacts", key = "#id")
    public Contact get(@PathVariable UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact not found"));
    }

    @PostMapping
    @CacheEvict(value = "contacts", allEntries = true)
    public ResponseEntity<Contact> create(@Valid @RequestBody Contact contact) {
        Contact saved = repository.save(contact);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    @CacheEvict(value = "contacts", allEntries = true)
    public Contact update(@PathVariable UUID id, @Valid @RequestBody Contact contact) {
        Contact existing = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact not found"));

        existing.setFirstName(contact.getFirstName());
        existing.setLastName(contact.getLastName());
        existing.setEmail(contact.getEmail());
        existing.setPhone(contact.getPhone());
        existing.setCompany(contact.getCompany());
        existing.setRole(contact.getRole());
        existing.setNotes(contact.getNotes());

        return repository.save(existing);
    }

    @DeleteMapping("/{id}")
    @CacheEvict(value = "contacts", allEntries = true)
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact not found");
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
