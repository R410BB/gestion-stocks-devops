
package com.gestionstocks.backend.service;

import com.gestionstocks.backend.entity.Produit;
import com.gestionstocks.backend.repository.ProduitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProduitService {

    private final ProduitRepository produitRepository;

    public ProduitService(ProduitRepository produitRepository) {
        this.produitRepository = produitRepository;
    }

    public Produit ajouterProduit(Produit produit) {
        if (produitRepository.existsByReference(produit.getReference())) {
            throw new IllegalArgumentException(
                "Un produit avec cette référence existe déjà"
            );
        }
        return produitRepository.save(produit);
    }

    @Transactional(readOnly = true)
    public List<Produit> obtenirTousLesProduits() {
        return produitRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Produit obtenirProduitParId(Long id) {
        return produitRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException(
                "Produit introuvable avec l'identifiant : " + id
            ));
    }

    public Produit modifierProduit(Long id, Produit modifications) {
        Produit produit = obtenirProduitParId(id);

        if (!produit.getReference().equals(modifications.getReference())
                && produitRepository.existsByReference(modifications.getReference())) {
            throw new IllegalArgumentException(
                "Cette référence est déjà utilisée"
            );
        }

        produit.setNom(modifications.getNom());
        produit.setReference(modifications.getReference());
        produit.setDescription(modifications.getDescription());
        produit.setPrix(modifications.getPrix());
        produit.setQuantite(modifications.getQuantite());
        produit.setSeuilAlerte(modifications.getSeuilAlerte());

        return produitRepository.save(produit);
    }

    public void supprimerProduit(Long id) {
        Produit produit = obtenirProduitParId(id);
        produitRepository.delete(produit);
    }
}
