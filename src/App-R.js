import { useState, useEffect } from 'react';
import { supabase } from './supabase-client'; 
import './App.css';

function App() {
  
  const [listeCours, setListeCours] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    
    const fetchCours = async () => {
      try {
        setChargement(true);

        const { data, error } = await supabase
          .from('Cours') // 
          .select('*');
          
        if (error) throw error;

        if (data) {
          setListeCours(data); 
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setChargement(false);
      }
    };

    fetchCours();
  }, []);

  return (
    <div className="container">
      <h1>Liste des Cours depuis Supabase</h1>

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