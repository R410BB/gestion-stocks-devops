
package com.gestionstocks.backend.controller;

import com.gestionstocks.backend.entity.Produit;
import com.gestionstocks.backend.service.ProduitService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produits")
public class ProduitController {

    private final ProduitService produitService;

    public ProduitController(ProduitService produitService) {
        this.produitService = produitService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Produit ajouterProduit(@Valid @RequestBody Produit produit) {
        return produitService.ajouterProduit(produit);
    }

    @GetMapping
    public List<Produit> obtenirTousLesProduits() {
        return produitService.obtenirTousLesProduits();
    }

    @GetMapping("/{id}")
    public Produit obtenirProduitParId(@PathVariable Long id) {
        return produitService.obtenirProduitParId(id);
    }

    @PutMapping("/{id}")
    public Produit modifierProduit(
            @PathVariable Long id,
            @Valid @RequestBody Produit produit) {
        return produitService.modifierProduit(id, produit);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void supprimerProduit(@PathVariable Long id) {
        produitService.supprimerProduit(id);
    }
}
