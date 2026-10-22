// package com.leaveease.backend.controller;

// import com.leaveease.backend.model.User;
// import com.leaveease.backend.service.UserService;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @RestController
// @RequestMapping("/api/users")
// public class UserController {

//     private final UserService userService;

//     public UserController(UserService userService) {
//         this.userService = userService;
//     }

//     // Register
//     @PostMapping("/register")
//     public User registerUser(@RequestBody User user) {
//         return userService.registerUser(user);
//     }

//     // Get all users
//     @GetMapping
//     public List<User> getAllUsers() {
//         return userService.getAllUsers();
//     }

//     // Get user by ID
//     @GetMapping("/{id}")
//     public User getUserById(@PathVariable Long id) {
//         return userService.getUserById(id);
//     }
// }



package com.leaveease.backend.controller;

import com.leaveease.backend.model.User;
import com.leaveease.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Register
    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }

    // Login  (used by the React Login page)
    @PostMapping("/login")
    public User login(@RequestBody Map<String, String> body) {
        return userService.login(body.get("email"), body.get("password"));
    }

    // Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Get user by ID
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }
}