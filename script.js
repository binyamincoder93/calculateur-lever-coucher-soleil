// Remplace avec ta clé API SerpApi
const apiKey = '6165916694c6c7025deef5ab';  

// Exemple de requête pour rechercher quelque chose comme 'Coffee' à Austin, Texas
const city = 'Austin, Texas'; // La ville de ta recherche
const query = 'Coffee'; // Le terme de recherche

// Fonction pour récupérer les résultats via SerpApi
async function fetchSearchResults() {
    const url = `https://serpapi.com/search.json?q=${query}&location=${city}&hl=en&gl=us&google_domain=google.com&api_key=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        // Vérification des résultats
        console.log(data);
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }
}

// Appeler la fonction pour obtenir les données
fetchSearchResults();
