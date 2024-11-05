document.getElementById("searchBtn").addEventListener("click", async function () {
    const city = document.getElementById("cityInput").value.trim();
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = ""; // Réinitialiser le contenu précédent

    // Vérification des coordonnées de la ville via API
    const coordinates = await getCoordinates(city);
    
    if (!coordinates) {
        alert("Ville non trouvée. Essayez une autre ville.");
        return;
    }

    const today = new Date();
    const dayOfYear = getDayOfYear(today);
    const sunData = calculateSunriseSunset(coordinates.lat, coordinates.lng, dayOfYear);

    resultDiv.innerHTML = `
        <h2>Données pour ${city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()}</h2>
        <p>Lever du soleil : ${sunData.sunrise.toFixed(2)}h</p>
        <p>Coucher du soleil : ${sunData.sunset.toFixed(2)}h</p>
    `;
});

// Fonction pour obtenir les coordonnées d'une ville
async function getCoordinates(city) {
    try {
        const apiKey = '314115653ca54d109238cf1b1060a7bf'; // Ta clé API
        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${apiKey}`);
        const data = response.data;

        if (data.results.length === 0) {
            return null; // Aucune ville trouvée
        }

        return {
            lat: data.results[0].geometry.lat,
            lng: data.results[0].geometry.lng,
        };
    } catch (error) {
        console.error("Erreur lors de la récupération des coordonnées :", error);
        return null;
    }
}

// Fonction pour obtenir le jour de l'année
function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

// Fonction pour calculer le lever et coucher de soleil
function calculateSunriseSunset(latitude, longitude, dayOfYear) {
    const rad = Math.PI / 180;
    const delta = 23.44 * rad * Math.sin((360 / 365) * (dayOfYear - 81) * rad); // Déclinaison du soleil
    const H = longitude / 15; // Heure solaire moyenne

    // Calcul de l'angle horaire
    const hourAngle = Math.acos(-Math.tan(latitude * rad) * Math.tan(delta)) * (180 / Math.PI);

    // Calcul des heures de lever et coucher
    const sunrise = 12 - (hourAngle / 15) + H; // Lever du soleil
    const sunset = 12 + (hourAngle / 15) + H; // Coucher du soleil

    return {
        sunrise: sunrise,
        sunset: sunset
    };
}