// src/pages/CharacterSheetPage.tsx
import React, { useState } from 'react';

export const CharacterSheetPage = () => {
  // Stato per gestire i valori del form
  const [formData, setFormData] = useState({
    name: "",
    race: "",
    characterClass: "",
    level: "",
    background: "",
    alignment: "",
    description: ""
  });

  // Funzione per aggiornare lo stato al variare degli input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Funzione di submit (in questo esempio solo logga i dati)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Dati Personaggio:", formData);
    // Qui potrai chiamare una API o aggiornare lo state globale per salvare i dati
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Inserisci la Scheda del Personaggio D&D</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="name">Nome:</label><br />
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="race">Razza:</label><br />
          <input
            type="text"
            id="race"
            name="race"
            value={formData.race}
            onChange={handleChange}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="characterClass">Classe:</label><br />
          <input
            type="text"
            id="characterClass"
            name="characterClass"
            value={formData.characterClass}
            onChange={handleChange}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="level">Livello:</label><br />
          <input
            type="number"
            id="level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="background">Background:</label><br />
          <textarea
            id="background"
            name="background"
            value={formData.background}
            onChange={handleChange}
            style={{ width: '100%', minHeight: '80px' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="alignment">Allineamento:</label><br />
          <input
            type="text"
            id="alignment"
            name="alignment"
            value={formData.alignment}
            onChange={handleChange}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="description">Descrizione:</label><br />
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={{ width: '100%', minHeight: '80px' }}
          />
        </div>
        <button type="submit">Salva Scheda</button>
      </form>
    </div>
  );
};
