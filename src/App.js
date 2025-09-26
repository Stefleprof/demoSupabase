import { useState, useEffect } from 'react';
import { supabase } from './supabase-client';

import './App.css';
import MyComponent from './componants/MyComponent';

function App() {
  const [listeCours, setListeCours] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [nouveauNom, setNouveauNom] = useState('');
  const [nouveauCode, setNouveauCode] = useState('');
  const [editingCours, setEditingCours] = useState(null);

  // ... (useEffect pour fetchCours est inchangé)
  useEffect(() => {
    const fetchCours = async () => {
      try {
        setChargement(true);
        const { data, error } = await supabase.from('Cours').select('*');
        //const { data, error } = await supabase.rpc('get_all_courses'); // Appel de la fonction RPC
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

  // ... (useEffect pour l'édition est inchangé)
  useEffect(() => {
    if (editingCours) {
      setNouveauNom(editingCours.nomCours);
      setNouveauCode(editingCours.codeCours);
    } else {
      setNouveauNom('');
      setNouveauCode('');
    }
  }, [editingCours]);

  // ... (fonctions ajouterCours et mettreAJourCours inchangées)
  const ajouterCours = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from('Cours').insert([{ nomCours: nouveauNom, codeCours: nouveauCode }]).select();
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

  const mettreAJourCours = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from('Cours').update({ nomCours: nouveauNom, codeCours: nouveauCode }).eq('id', editingCours.id).select();
      if (error) throw error;
      if (data) {
        setListeCours(listeCours.map((cours) => (cours.id === editingCours.id ? data[0] : cours)));
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setEditingCours(null);
    }
  };

  // NOUVELLE FONCTION SUPPRIMER
  const supprimerCours = async (id) => {
    if (!window.confirm("Es-tu sûr de vouloir supprimer ce cours ?")) {
      return;
    }
    try {
      const { error } = await supabase.from('Cours').delete().eq('id', id);
      if (error) throw error;
      setListeCours(listeCours.filter((cours) => cours.id !== id));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container" >
      <p classNAme ="text-xl" >Liste des Cours</p>
      
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
                <button className='bg-black text-white font-bold py-1 px-4 rounded-lg hover:bg-gray-500 hover:text-black ' onClick={() => setEditingCours(unCours)}>Modifier</button>
                <button onClick={() => supprimerCours(unCours.id)} className="delete-button">
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className='flex items-center justify-center '>
        <p>Le composant est ici ...</p>
        <MyComponent />
      </div>
      
    </div>
  );
}

export default App;