package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.model.Role;

import java.util.List;
import java.util.Optional;

public interface RoleService {
    void saveRole(Role role);

    void removeRoleById(long id);

    Role getRoleById(long id);

    List<Role> getAllRoles();

    Optional<Role> getRoleByName(String name);
}
