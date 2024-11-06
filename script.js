const apiKey = '6165916694c6c7025deef5ab';  
const city = 'Paris, France'; // La ville pour la recherche
const query = 'Sunrise'; // Le terme de recherche

async function fetchSearchResults() {
    const url = `https://serpapi.com/search.json?q=${query}&location=${city}&hl=en&gl=us&google_domain=google.com&api_key=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Affichage des résultats dans un élément HTML
        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = `<h2>Résultats pour ${city} :</h2>`;

        data.organic_results.forEach(result => {
            resultDiv.innerHTML += `<p><a href="${result.link}" target="_blank">${result.title}</a></p>`;
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }
}

fetchSearchResults();
