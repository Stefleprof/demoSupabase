import { useState, useEffect } from 'react';
import { supabase } from './supabase-client';
import './App.css';

function App() {
  const [listeCours, setListeCours] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [nouveauNom, setNouveauNom] = useState('');
  const [nouveauCode, setNouveauCode] = useState('');
  const [editingCours, setEditingCours] = useState(null); // État pour l'édition

  // Récupère les cours au chargement
  useEffect(() => {
    // ... (code inchangé pour fetchCours)
    const fetchCours = async () => {
      try {
        setChargement(true);
        const { data, error } = await supabase.from('Cours').select('*');
        if (error) throw error;
        if (data) setListeCours(data);
      } catch (error) {
        alert(error.message);
      } finally {
        setChargement(false);
      }
    };
    fetchCours();
  }, []);
  
  // Remplit le formulaire quand on entre en mode édition
  useEffect(() => {
    if (editingCours) {
      setNouveauNom(editingCours.nomCours);
      setNouveauCode(editingCours.codeCours);
    } else {
      setNouveauNom('');
      setNouveauCode('');
    }
  }, [editingCours]);

  // Fonction AJOUTER
  const ajouterCours = async (e) => {
    // ... (code inchangé)
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('Cours')
        .insert([{ nomCours: nouveauNom, codeCours: nouveauCode }])
        .select();

      if (error) throw error;
      
      if (data) {
        setListeCours([...listeCours, data[0]]);
        setNouveauNom('');
        setNouveauCode('');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // Fonction METTRE À JOUR
  const mettreAJourCours = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('Cours')
        .update({ nomCours: nouveauNom, codeCours: nouveauCode })
        .eq('id', editingCours.id)
        .select();

      if (error) throw error;
      
      if (data) {
        setListeCours(
          listeCours.map((cours) =>
            cours.id === editingCours.id ? data[0] : cours
          )
        );
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setEditingCours(null);
    }
  };

  return (
    <div className="container">
      <h1>Liste des Cours</h1>

      <form onSubmit={editingCours ? mettreAJourCours : ajouterCours}>
        <h2>{editingCours ? 'Modifier le cours' : 'Ajouter un nouveau cours'}</h2>
        <input
          type="text"
          placeholder="Nom du cours"
          value={nouveauNom}
          onChange={(e) => setNouveauNom(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Code du cours"
          value={nouveauCode}
          onChange={(e) => setNouveauCode(e.target.value)}
          required
        />
        <button type="submit">{editingCours ? 'Mettre à jour' : 'Ajouter'}</button>
        {editingCours && (
          <button type="button" onClick={() => setEditingCours(null)}>Annuler</button>
        )}
      </form>

      <hr />

      {chargement ? (
        <p>Chargement...</p>
      ) : (
        <ul>
          {listeCours.map((unCours) => (
            <li key={unCours.id}>
              <span>
                <strong>{unCours.nomCours}</strong> ({unCours.codeCours})
              </span>
              <div>
                <button onClick={() => setEditingCours(unCours)}>Modifier</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;