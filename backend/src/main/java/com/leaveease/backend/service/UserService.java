// package com.leaveease.backend.service;

// import com.leaveease.backend.model.User;
// import com.leaveease.backend.repository.UserRepository;
// import org.springframework.stereotype.Service;

// import java.util.List;

// @Service
// public class UserService {

//     private final UserRepository userRepository;

//     public UserService(UserRepository userRepository) {
//         this.userRepository = userRepository;
//     }

//     // Register user
//     public User registerUser(User user) {

//         if (userRepository.findByEmail(user.getEmail()).isPresent()) {
//             throw new RuntimeException("Email already registered");
//         }

//         if (user.getRole() == null || user.getRole().isBlank()) {
//             user.setRole("EMPLOYEE");
//         }

//         return userRepository.save(user);
//     }

//     // Get all users
//     public List<User> getAllUsers() {
//         return userRepository.findAll();
//     }

//     // Get user by ID
//     public User getUserById(Long id) {
//         return userRepository.findById(id)
//                 .orElseThrow(() -> new RuntimeException("User not found"));
//     }
// }






package com.leaveease.backend.service;

import com.leaveease.backend.model.User;
import com.leaveease.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    // Static admin credentials come from application.properties
    private final String adminEmail;
    private final String adminPassword;
    private final String adminName;

    public UserService(
            UserRepository userRepository,
            @Value("${leaveease.admin.email}") String adminEmail,
            @Value("${leaveease.admin.password}") String adminPassword,
            @Value("${leaveease.admin.name:Administrator}") String adminName) {
        this.userRepository = userRepository;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
        this.adminName = adminName;
    }

    // Register user (always creates an EMPLOYEE; admin is static)
    public User registerUser(User user) {
        String email = user.getEmail() == null ? "" : user.getEmail().trim();

        if (email.equalsIgnoreCase(adminEmail)) {
            throw new RuntimeException("Email already registered");
        }

        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        user.setEmail(email);
        user.setRole("EMPLOYEE");

        return userRepository.save(user);
    }

    // Login user
    public User login(String email, String password) {
        if (email == null || password == null) {
            throw invalidCredentials();
        }

        String cleanEmail = email.trim();

        // 1) Static admin login
        if (cleanEmail.equalsIgnoreCase(adminEmail)) {
            if (!password.equals(adminPassword)) {
                throw invalidCredentials();
            }

            User admin = new User(adminName, adminEmail, null, "ADMIN");
            admin.setId(0L);
            return admin;
        }

        // 2) Normal employee login from the database
        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(this::invalidCredentials);

        if (!password.equals(user.getPassword())) {
            throw invalidCredentials();
        }

        return user;
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by ID
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private ResponseStatusException invalidCredentials() {
        return new ResponseStatusException(
                HttpStatus.UNAUTHORIZED, "Invalid email or password");
    }
}