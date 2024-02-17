package ru.kata.spring.boot_security.demo.config.SecurityConfig;

import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repositories.UserRepository;
import ru.kata.spring.boot_security.demo.service.RoleService;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataLoader implements ApplicationRunner {

    private final UserRepository userRepository;
    private final RoleService roleService;

    private final PasswordEncoder passwordEncoder;

    public DataLoader(UserRepository userRepository, RoleService roleService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleService = roleService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    @Override
    public void run(ApplicationArguments args) {
        if (userRepository.findByEmail("admin@admin.com").isEmpty()) {
            roleService.saveRole(new Role("ROLE_ADMIN"));
            roleService.saveRole(new Role("ROLE_USER"));
            Set<Role> roleHashSetAdmin = new HashSet<>(roleService.getAllRoles());
            Set<Role> roleHashSetUser = new HashSet<>();
            roleHashSetUser.add(roleService.getRoleById(2));
            userRepository.save(new User("admin", "admin", 20, "admin@admin.com",
                    passwordEncoder.encode("admin"), roleHashSetAdmin));
            userRepository.save(new User("user1", "user1", 12, "user1@user1.com",
                    passwordEncoder.encode("user1"), roleHashSetUser));
        }
    }
}
