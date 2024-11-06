// Fonction pour récupérer les coordonnées d'une ville via l'API OpenCageData
async function getCoordinates(city) {
    const apiKey = 'YOUR_API_KEY';  // Insère ta clé API OpenCage ici
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results.length > 0) {
            return {
                lat: data.results[0].geometry.lat,
                lng: data.results[0].geometry.lng
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des coordonnées :", error);
        return null;
    }
}

// Fonction pour récupérer les horaires de lever et coucher du soleil avec SunriseSunset.io
async function getSunriseSunset(city) {
    const coordinates = await getCoordinates(city);  // Obtient la latitude et la longitude de la ville
    
    if (!coordinates) {
        alert("Ville non trouvée. Essayez une autre ville.");
        return;
    }

    const latitude = coordinates.lat;
    const longitude = coordinates.lng;

    const url = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`; // Formatté en ISO 8601 (UTC)

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.status === "OK") {
            const sunrise = new Date(data.results.sunrise);  // Heure du lever du soleil
            const sunset = new Date(data.results.sunset);    // Heure du coucher du soleil

            // Conversion en heures locales
            const sunriseHours = sunrise.getHours() + (sunrise.getMinutes() / 60);
            const sunsetHours = sunset.getHours() + (sunset.getMinutes() / 60);

            const resultDiv = document.getElementById("result");
            resultDiv.innerHTML = `
                <h2>Données pour ${city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()}</h2>
                <p>Lever du soleil : ${sunriseHours.toFixed(2)}h</p>
                <p>Coucher du soleil : ${sunsetHours.toFixed(2)}h</p>
            `;
        } else {
            alert("Erreur lors de la récupération des données.");
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }
}

// Événement au clic du bouton pour rechercher les horaires
document.getElementById("searchBtn").addEventListener("click", function() {
    const city = document.getElementById("cityInput").value.trim();
    if (city) {
        getSunriseSunset(city);  // Appel de la fonction pour récupérer les horaires
    } else {
        alert("Veuillez entrer un nom de ville.");
    }
});
