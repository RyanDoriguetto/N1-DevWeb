package com.example.coffee.repo;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.coffee.domain.entities.Role;
import com.example.coffee.domain.enums.RoleName;
public interface RoleRepository extends JpaRepository<Role, Long>{
  Optional<Role> findByName(RoleName name);
}
