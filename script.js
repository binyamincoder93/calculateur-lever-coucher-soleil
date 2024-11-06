document.getElementById("searchBtn").addEventListener("click", async function () {
    const city = document.getElementById("cityInput").value.trim();
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = ""; // Réinitialiser le contenu précédent

    if (!city) {
        alert("Veuillez entrer un nom de ville.");
        return;
    }

    // Vérifier la ville et obtenir les coordonnées via Google Maps API
    const coordinates = await getCoordinates(city);

    if (!coordinates) {
        alert("Ville non trouvée. Essayez une autre ville.");
        return;
    }

    // Obtenir les horaires de lever et coucher du soleil via l'API Sunrise-Sunset
    const sunData = await getSunriseSunset(coordinates.lat, coordinates.lng);

    resultDiv.innerHTML = `
        <h2>Données pour ${city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()}</h2>
        <p>Lever du soleil : ${sunData.sunrise}</p>
        <p>Coucher du soleil : ${sunData.sunset}</p>
    `;
});

// Fonction pour obtenir les coordonnées d'une ville via Google Maps API
async function getCoordinates(city) {
    try {
        const apiKey = 'VOTRE_CLE_API_GOOGLE_MAPS'; // Remplacez par votre clé API Google Maps
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${apiKey}`
        );

        const data = response.data;

        if (data.status !== "OK" || data.results.length === 0) {
            return null; // Aucune ville trouvée
        }

        const location = data.results[0].geometry.location;
        return {
            lat: location.lat,
            lng: location.lng,
        };
    } catch (error) {
        console.error("Erreur lors de la récupération des coordonnées :", error);
        return null;
    }
}

// Fonction pour obtenir le lever et coucher de soleil via Sunrise-Sunset API
async function getSunriseSunset(latitude, longitude) {
    try {
        const response = await axios.get(
            `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`
        );

        const data = response.data;

        // Conversion du temps en format lisible
        const sunrise = new Date(data.results.sunrise).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        });
        const sunset = new Date(data.results.sunset).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        });

        return { sunrise, sunset };
    } catch (error) {
        console.error("Erreur lors de la récupération des données de lever/coucher du soleil :", error);
        return null;
    }
}
