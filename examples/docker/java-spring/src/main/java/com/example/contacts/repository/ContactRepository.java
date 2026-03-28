package com.example.contacts.repository;

import com.example.contacts.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ContactRepository extends JpaRepository<Contact, UUID> {
    List<Contact> findByCompanyIgnoreCase(String company);
    List<Contact> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);
}
