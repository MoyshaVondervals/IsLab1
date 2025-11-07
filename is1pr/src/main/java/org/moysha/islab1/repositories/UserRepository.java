package org.moysha.islab1.repositories;

import org.moysha.islab1.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
//    boolean existsByEmail(String email);

}
