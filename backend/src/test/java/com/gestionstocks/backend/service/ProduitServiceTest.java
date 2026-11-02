
package com.gestionstocks.backend.service;

import com.gestionstocks.backend.entity.Produit;
import com.gestionstocks.backend.repository.ProduitRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProduitServiceTest {

    @Mock
    private ProduitRepository produitRepository;

    @InjectMocks
    private ProduitService produitService;

    @Test
    void ajouterProduit_referenceUnique_produitEnregistre() {

        // ARRANGE : préparer un produit
        Produit produit = new Produit();
        produit.setNom("Clavier Logitech");
        produit.setReference("CLAV-001");
        produit.setPrix(new BigDecimal("250.00"));
        produit.setQuantite(10);
        produit.setSeuilAlerte(3);

        // Simuler le comportement du repository
        when(produitRepository.existsByReference("CLAV-001"))
                .thenReturn(false);

        when(produitRepository.save(produit))
                .thenReturn(produit);

        // ACT : appeler la méthode à tester
        Produit resultat = produitService.ajouterProduit(produit);

        // ASSERT : vérifier le résultat
        assertNotNull(resultat);
        assertEquals("CLAV-001", resultat.getReference());
        assertEquals("Clavier Logitech", resultat.getNom());

        verify(produitRepository).save(produit);
    }


@Test
void ajouterProduit_referenceDupliquee_exceptionLevee() {

    // ARRANGE : créer un produit
    Produit produit = new Produit();
    produit.setNom("Clavier Logitech");
    produit.setReference("CLAV-001");

    // Simuler une référence déjà présente
    when(produitRepository.existsByReference("CLAV-001"))
            .thenReturn(true);

    // ACT + ASSERT : vérifier que l'ajout est refusé
    IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> produitService.ajouterProduit(produit)
    );

    assertEquals(
            "Un produit avec cette référence existe déjà",
            exception.getMessage()
    );

    // Vérifier qu'aucun enregistrement n'a été effectué
    verify(produitRepository, never()).save(any(Produit.class));
}
}