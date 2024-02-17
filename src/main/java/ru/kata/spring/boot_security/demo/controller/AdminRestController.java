package ru.kata.spring.boot_security.demo.controller;

import ru.kata.spring.boot_security.demo.ErrorHandler.ErrorsInfoHandler;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.validation.ValidationGroup1;
import ru.kata.spring.boot_security.demo.validation.ValidationGroup2;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("admin/api")
public class AdminRestController {

    private final UserService userService;

    public AdminRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> apiGetAllUsers() {
        List<User> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> apiGetOneUser(@PathVariable("id") long id) {
        User user = userService.getUserById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/auth")
    public ResponseEntity<User> apiGetAuth() {
        return new ResponseEntity<>(((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()), HttpStatus.OK);
    }

    @PostMapping("/users")
    public ResponseEntity<ErrorsInfoHandler> apiAddNewUser(@Validated(ValidationGroup1.class) @RequestBody User user, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return new ResponseEntity<>(new ErrorsInfoHandler(getErrorsFromBindingResult(bindingResult)), HttpStatus.BAD_REQUEST);
        }
        if (userService.findByEmail(user.getEmail()).isPresent()) {
            return new ResponseEntity<>(new ErrorsInfoHandler("A user with same email already exists"), HttpStatus.BAD_REQUEST);
        }
        userService.saveUser(user);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<ErrorsInfoHandler> apiUpdateUser(@PathVariable("id") long id, @Validated(ValidationGroup2.class) @RequestBody User user, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return new ResponseEntity<>(new ErrorsInfoHandler(getErrorsFromBindingResult(bindingResult)), HttpStatus.BAD_REQUEST);
        }
        if (checkUpdatingUserEmail(user)) {
            return new ResponseEntity<>(new ErrorsInfoHandler("A user with same email already exists"), HttpStatus.BAD_REQUEST);
        }
        userService.updateUser(user);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("users/{id}")
    public ResponseEntity<ErrorsInfoHandler> apiDeleteUser(@PathVariable("id") long id) {
        userService.removeUserById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    private String getErrorsFromBindingResult(BindingResult bindingResult) {
        return bindingResult.getFieldErrors()
                .stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.joining(", "));
    }

    private boolean checkUpdatingUserEmail(User user) {
        Optional<User> existingUserWithSameEmail = userService.findByEmail(user.getEmail());
        if (existingUserWithSameEmail.isPresent()) {
            User updatingUser = userService.getUserById(user.getId());
            return !existingUserWithSameEmail.get().getEmail().equals(updatingUser.getEmail());
        }

        return false;
    }

}
