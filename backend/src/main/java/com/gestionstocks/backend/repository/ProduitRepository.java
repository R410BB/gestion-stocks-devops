
package com.gestionstocks.backend.repository;

import com.gestionstocks.backend.entity.Produit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProduitRepository extends JpaRepository<Produit, Long> {

    Optional<Produit> findByReference(String reference);

    boolean existsByReference(String reference);
}
