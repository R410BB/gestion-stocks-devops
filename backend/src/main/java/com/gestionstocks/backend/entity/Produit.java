
package com.gestionstocks.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@Entity
@Table(name = "produits")
public class Produit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom est obligatoire")
    @Column(nullable = false)
    private String nom;

    @NotBlank(message = "La référence est obligatoire")
    @Column(nullable = false, unique = true)
    private String reference;

    @Column(length = 1000)
    private String description;

    @NotNull
    @DecimalMin(value = "0.0")
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal prix;

    @NotNull
    @Min(0)
    @Column(nullable = false)
    private Integer quantite;

    @NotNull
    @Min(0)
    @Column(nullable = false)
    private Integer seuilAlerte;

    public Produit() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getReference() { return reference; }
    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getDescription() { return description; }
    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrix() { return prix; }
    public void setPrix(BigDecimal prix) { this.prix = prix; }

    public Integer getQuantite() { return quantite; }
    public void setQuantite(Integer quantite) {
        this.quantite = quantite;
    }

    public Integer getSeuilAlerte() { return seuilAlerte; }
    public void setSeuilAlerte(Integer seuilAlerte) {
        this.seuilAlerte = seuilAlerte;
    }
}
