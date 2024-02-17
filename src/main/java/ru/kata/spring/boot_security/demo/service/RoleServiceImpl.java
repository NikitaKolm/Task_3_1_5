package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.model.Role;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.repositories.RoleRepository;

import java.util.List;
import java.util.Optional;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    @Transactional
    public void saveRole(Role role) {
        roleRepository.save(role);
    }

    @Override
    @Transactional
    public void removeRoleById(long id) {
        roleRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Role getRoleById(long id) {
        return roleRepository.findById(id).orElseGet(Role::new);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Role> getRoleByName(String name) {
        return roleRepository.findByName(name);
    }
}
