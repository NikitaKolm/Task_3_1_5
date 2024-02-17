package ru.kata.spring.boot_security.demo.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;
import org.springframework.security.core.GrantedAuthority;

import java.util.Set;

@Entity
@Table(name = "roles", uniqueConstraints = @UniqueConstraint(columnNames = "name"))
public class Role implements GrantedAuthority {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @JsonIdentityInfo(
            generator = ObjectIdGenerators.PropertyGenerator.class,
            property = "id"
    )
    @ManyToMany(mappedBy = "roles")
    @Cascade({CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST})
    private Set<User> users;

    public Role() {
    }

    public Role(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    @Override
    public String toString() {
        if (name.equals("ROLE_ADMIN")) {
            return "ADMIN";
        } else if (name.equals("ROLE_USER")) {
            return "USER";
        }

        return "";
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Role other = (Role) obj;
        if (id == null) {
            return other.id == null;
        } else return id.equals(other.id);
    }

    @Override
    public String getAuthority() {
        return name;
    }
}
