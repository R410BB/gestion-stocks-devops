
import { useEffect, useState } from 'react'
import './App.css'

const formulaireVide = {
  nom: '',
  reference: '',
  description: '',
  prix: '',
  quantite: '',
  seuilAlerte: ''
}

function App() {
  const [produits, setProduits] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')
  const [message, setMessage] = useState('')
  const [enregistrement, setEnregistrement] = useState(false)
  const [suppressionId, setSuppressionId] = useState(null)
  const [produitEnEdition, setProduitEnEdition] = useState(null)
  const [nouveauProduit, setNouveauProduit] = useState({
    ...formulaireVide
  })

  useEffect(() => {
    fetch('/api/produits')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des produits')
        }
        return response.json()
      })
      .then(setProduits)
      .catch((error) => setErreur(error.message))
      .finally(() => setChargement(false))
  }, [])

  const modifierChamp = (champ, valeur) => {
    setNouveauProduit((actuel) => ({
      ...actuel,
      [champ]: valeur
    }))
  }

  const annulerModification = () => {
    setProduitEnEdition(null)
    setNouveauProduit({ ...formulaireVide })
    setErreur('')
    setMessage('')
  }

  const commencerModification = (produit) => {
    setProduitEnEdition(produit.id)

    setNouveauProduit({
      nom: produit.nom ?? '',
      reference: produit.reference ?? '',
      description: produit.description ?? '',
      prix: String(produit.prix ?? ''),
      quantite: String(produit.quantite ?? ''),
      seuilAlerte: String(produit.seuilAlerte ?? '')
    })

    setErreur('')
    setMessage('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const enregistrerProduit = async (e) => {
    e.preventDefault()
    setErreur('')
    setMessage('')
    setEnregistrement(true)

    const modification = produitEnEdition !== null

    const donnees = {
      nom: nouveauProduit.nom.trim(),
      reference: nouveauProduit.reference.trim(),
      description: nouveauProduit.description.trim(),
      prix: Number(nouveauProduit.prix),
      quantite: Number(nouveauProduit.quantite),
      seuilAlerte: Number(nouveauProduit.seuilAlerte)
    }

    try {
      const url = modification
        ? `/api/produits/${produitEnEdition}`
        : '/api/produits'

      const response = await fetch(url, {
        method: modification ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(donnees)
      })

      if (!response.ok) {
        throw new Error(
          response.status === 409
            ? 'Cette référence existe déjà.'
            : modification
              ? 'Impossible de modifier le produit.'
              : 'Impossible d’ajouter le produit.'
        )
      }

      const produitEnregistre = await response.json()

      if (modification) {
        setProduits((actuels) =>
          actuels.map((produit) =>
            produit.id === produitEnEdition
              ? produitEnregistre
              : produit
          )
        )
        setMessage('Produit modifié avec succès !')
      } else {
        setProduits((actuels) => [
          ...actuels,
          produitEnregistre
        ])
        setMessage('Produit ajouté avec succès !')
      }

      setProduitEnEdition(null)
      setNouveauProduit({ ...formulaireVide })
    } catch (error) {
      setErreur(error.message)
    } finally {
      setEnregistrement(false)
    }
  }

  const supprimerProduit = async (produit) => {
    const confirmation = window.confirm(
      `Voulez-vous vraiment supprimer "${produit.nom}" ?`
    )

    if (!confirmation) return

    setErreur('')
    setMessage('')
    setSuppressionId(produit.id)

    try {
      const response = await fetch(
        `/api/produits/${produit.id}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        throw new Error('Impossible de supprimer le produit.')
      }

      setProduits((actuels) =>
        actuels.filter((p) => p.id !== produit.id)
      )

      if (produitEnEdition === produit.id) {
        setProduitEnEdition(null)
        setNouveauProduit({ ...formulaireVide })
      }

      setMessage('Produit supprimé avec succès !')
    } catch (error) {
      setErreur(error.message)
    } finally {
      setSuppressionId(null)
    }
  }

  const nombreProduits = produits.length

  const produitsEnAlerte = produits.filter(
    (produit) =>
      produit.quantite <= produit.seuilAlerte
  ).length

  return (
    <div>
      <h1>Gestion des Stocks</h1>
      <p>
        Application de gestion des produits et des
        mouvements de stock
      </p>

      <div className="statistiques">
        <div className="statistique">
          <span>Produits enregistrés</span>
          <strong>{nombreProduits}</strong>
        </div>

        <div className="statistique">
          <span>Produits en alerte</span>
          <strong>{produitsEnAlerte}</strong>
        </div>
      </div>

      <h2>
        {produitEnEdition !== null
          ? 'Modifier un produit'
          : 'Ajouter un produit'}
      </h2>

      <form onSubmit={enregistrerProduit}>
        <input
          type="text"
          aria-label="Nom du produit"
          placeholder="Nom du produit"
          value={nouveauProduit.nom}
          onChange={(e) =>
            modifierChamp('nom', e.target.value)
          }
          required
        />

        <input
          type="text"
          aria-label="Référence"
          placeholder="Référence"
          value={nouveauProduit.reference}
          onChange={(e) =>
            modifierChamp('reference', e.target.value)
          }
          required
        />

        <input
          type="text"
          aria-label="Description"
          placeholder="Description (facultative)"
          value={nouveauProduit.description}
          onChange={(e) =>
            modifierChamp('description', e.target.value)
          }
          maxLength={1000}
        />

        <input
          type="number"
          aria-label="Prix"
          placeholder="Prix"
          min="0"
          step="0.01"
          value={nouveauProduit.prix}
          onChange={(e) =>
            modifierChamp('prix', e.target.value)
          }
          required
        />

        <input
          type="number"
          aria-label="Quantité"
          placeholder="Quantité"
          min="0"
          step="1"
          value={nouveauProduit.quantite}
          onChange={(e) =>
            modifierChamp('quantite', e.target.value)
          }
          required
        />

        <input
          type="number"
          aria-label="Seuil d'alerte"
          placeholder="Seuil d'alerte"
          min="0"
          step="1"
          value={nouveauProduit.seuilAlerte}
          onChange={(e) =>
            modifierChamp('seuilAlerte', e.target.value)
          }
          required
        />

        <button type="submit" disabled={enregistrement}>
          {enregistrement
            ? 'Enregistrement...'
            : produitEnEdition !== null
              ? 'Enregistrer les modifications'
              : 'Ajouter le produit'}
        </button>

        {produitEnEdition !== null && (
          <button
            type="button"
            className="bouton-annuler"
            onClick={annulerModification}
            disabled={enregistrement}
          >
            Annuler
          </button>
        )}
      </form>

      {message && (
        <p className="message-succes" role="status">
          {message}
        </p>
      )}

      {erreur && (
        <p className="message-erreur" role="alert">
          {erreur}
        </p>
      )}

      <h2>Liste des produits</h2>

      {chargement && <p>Chargement des produits...</p>}

      {!chargement && (
        <div className="tableau-conteneur">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Référence</th>
                <th>Prix</th>
                <th>Quantité</th>
                <th>Seuil d'alerte</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {produits.map((produit) => {
                const enAlerte =
                  produit.quantite <= produit.seuilAlerte

                return (
                  <tr key={produit.id}>
                    <td>{produit.id}</td>
                    <td>{produit.nom}</td>
                    <td>{produit.reference}</td>
                    <td>{produit.prix}</td>
                    <td>{produit.quantite}</td>
                    <td>{produit.seuilAlerte}</td>

                    <td>
                      <span
                        className={
                          enAlerte
                            ? 'badge-alerte'
                            : 'badge-normal'
                        }
                      >
                        {enAlerte
                          ? 'Stock faible'
                          : 'Disponible'}
                      </span>
                    </td>

                    <td>
                      <div className="actions">
                        <button
                          type="button"
                          className="bouton-modifier"
                          onClick={() =>
                            commencerModification(produit)
                          }
                          disabled={enregistrement || suppressionId !== null}
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          className="bouton-supprimer"
                          onClick={() =>
                            supprimerProduit(produit)
                          }
                          disabled={enregistrement || suppressionId !== null}
                        >
                          {suppressionId === produit.id
                            ? 'Suppression...'
                            : 'Supprimer'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {produits.length === 0 && (
                <tr>
                  <td colSpan="8">
                    Aucun produit enregistré.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default App
