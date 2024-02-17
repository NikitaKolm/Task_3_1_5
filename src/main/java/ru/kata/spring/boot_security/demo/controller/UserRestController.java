package ru.kata.spring.boot_security.demo.controller;

import ru.kata.spring.boot_security.demo.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("user/api")
public class UserRestController {
    @GetMapping("/auth")
    public ResponseEntity<User> apiGetAuth() {
        return new ResponseEntity<>(((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()), HttpStatus.OK);
    }
}
