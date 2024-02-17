package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repositories.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, RoleService roleService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleService = roleService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        List<Role> roles = new ArrayList<>();
        roles.add(roleService.getRoleByName("ROLE_" + user.getRole()).orElse(new Role()));
        user.setRoles(roles);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void updateUser(User user) {
        List<Role> roles = new ArrayList<>();
        roles.add(roleService.getRoleByName("ROLE_" + user.getRole()).orElse(new Role()));
        user.setRoles(roles);
        if (user.getPassword().isEmpty()) {
            user.setPassword(userRepository.findById(user.getId())
                    .orElseThrow(() -> new UsernameNotFoundException("User with id = " + user.getId() + "not found"))
                    .getPassword());
        } else {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        userRepository.save(user);
    }

    @Override
    @Transactional
    public void removeUserById(long id) {
        userRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public User getUserById(long id) {
        return userRepository.findById(id).orElseGet(User::new);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> user = findByEmail(email);
        if (user.isEmpty()) {
            throw new UsernameNotFoundException("User not found");
        }

        return user.get();
    }
}
