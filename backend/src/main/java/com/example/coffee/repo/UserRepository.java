package com.example.coffee.repo;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.coffee.domain.entities.User;
public interface UserRepository extends JpaRepository<User, Long>{
  Optional<User> findByEmail(String email);
}
