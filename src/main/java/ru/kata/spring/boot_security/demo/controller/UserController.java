package ru.kata.spring.boot_security.demo.controller;

import ru.kata.spring.boot_security.demo.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/user")
public class UserController {
    UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping(value = "/userInfo")
    public String getUserList(Model model) {
        return "/user/userInfo";
    }
}
