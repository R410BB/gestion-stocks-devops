
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [produits, setProduits] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    fetch('/api/produits')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des produits')
        }
        return response.json()
      })
      .then((data) => {
        setProduits(data)
      })
      .catch((error) => {
        setErreur(error.message)
      })
      .finally(() => {
        setChargement(false)
      })
  }, [])

  return (
    <div>
      <h1>Gestion des Stocks</h1>
      <p>Application de gestion des produits et des mouvements de stock</p>

      <h2>Liste des produits</h2>

      {chargement && <p>Chargement des produits...</p>}

      {erreur && <p style={{ color: 'red' }}>{erreur}</p>}

      {!chargement && !erreur && (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Référence</th>
              <th>Prix</th>
              <th>Quantité</th>
              <th>Seuil d'alerte</th>
            </tr>
          </thead>
          <tbody>
            {produits.map((produit) => (
              <tr key={produit.id}>
                <td>{produit.id}</td>
                <td>{produit.nom}</td>
                <td>{produit.reference}</td>
                <td>{produit.prix}</td>
                <td>{produit.quantite}</td>
                <td>{produit.seuilAlerte}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default App
