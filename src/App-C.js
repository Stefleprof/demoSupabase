import { useState, useEffect } from 'react';
import { supabase } from './supabase-client';
import './App.css';

function App() {
  const [listeCours, setListeCours] = useState([]);
  const [chargement, setChargement] = useState(true);
  
  // États pour le formulaire
  const [nouveauNom, setNouveauNom] = useState('');
  const [nouveauCode, setNouveauCode] = useState('');

  // Récupère les cours au chargement
  useEffect(() => {
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

  // Fonction pour ajouter un cours
  const ajouterCours = async (e) => {
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

  return (
    <div className="container">
      <h1>Liste des Cours</h1>

      <form onSubmit={ajouterCours} className="form-container">
        <h2>Ajouter un nouveau cours</h2>
        <input
          type="text"
          placeholder="Nom du cours"
          value={nouveauNom}
          onChange={(e) => setNouveauNom(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Code du cours (ex: 420-VAB-LP)"
          value={nouveauCode}
          onChange={(e) => setNouveauCode(e.target.value)}
          required
        />
        <button type="submit">Ajouter</button>
      </form>

      <hr />

      {chargement ? (
        <p>Chargement des cours...</p>
      ) : (
        <ul>
          {listeCours.map((unCours) => (
            <li key={unCours.id}>
              <strong>{unCours.nomCours}</strong> ({unCours.codeCours})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;