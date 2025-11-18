// Configuration initiale
const CONFIG = {
  localEnvironment: {
    enabled: true,
    tempAdjustment: -1.5,
    humidityAdjustment: 5,
    name: "Zone boisée",
  },
};

// Variables globales
let lastWeatherData = null;
let lastCityName = null;
let lastForecastAt6h = null;
let lastFormattedDate = null;
let lastTarget6am = null;

// Ajout du bouton de configuration
function addConfigButton() {
  const configDiv = document.createElement("div");
  configDiv.id = "configContainer";
  configDiv.innerHTML = `
    <button id="configButton" class="config-btn">⚙️ Modifier l'environnement du logement</button>
    <div id="configPanel">
      <h3>Paramètres locaux</h3>
      <div class="checkbox-container">
        <input type="checkbox" id="enableLocal" ${
          CONFIG.localEnvironment.enabled ? "checked" : ""
        }>
        <label for="enableLocal">Activer l'ajustement local</label>
      </div>
      <div id="localSettings" style="${
        CONFIG.localEnvironment.enabled ? "" : "display: none;"
      }">
        <div class="input-group">
          <label for="envType">Environnement</label>
          <select id="envType">
            <option value="wooded" ${
              CONFIG.localEnvironment.name === "Zone boisée" ? "selected" : ""
            }>Zone boisée</option>
            <option value="urban" ${
              CONFIG.localEnvironment.name === "Zone urbaine" ? "selected" : ""
            }>Zone urbaine</option>
            <option value="rural" ${
              CONFIG.localEnvironment.name === "Zone rurale" ? "selected" : ""
            }>Zone rurale</option>
            <option value="custom" ${
              !["Zone boisée", "Zone urbaine", "Zone rurale"].includes(
                CONFIG.localEnvironment.name
              )
                ? "selected"
                : ""
            }>Personnalisé</option>
          </select>
        </div>
        <div class="input-grid">
          <div>
            <label for="tempAdjust">Température (°C)</label>
            <input type="number" id="tempAdjust" value="${
              CONFIG.localEnvironment.tempAdjustment
            }" step="0.1">
          </div>
          <div>
            <label for="humidityAdjust">Humidité (%)</label>
            <input type="number" id="humidityAdjust" value="${
              CONFIG.localEnvironment.humidityAdjustment
            }" step="1">
          </div>
        </div>
      </div>
      <button id="saveConfig">Enregistrer</button>
    </div>
  `;

  const style = document.createElement("style");
  style.textContent = `
    #configContainer { text-align: center; margin-top: 20px; }
    .config-btn { padding: 8px 15px; background-color: #f0f0f0; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; width: 100%; max-width: 200px; display: inline-block; }
    #configPanel { display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; border: 1px solid #ccc; padding: 15px; border-radius: 4px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); z-index: 1000; width: 90%; max-width: 300px; }
    #configPanel h3 { margin: 0 0 15px; text-align: center; }
    .checkbox-container { display: flex; align-items: center; margin-bottom: 10px; }
    .checkbox-container input { margin-right: 10px; }
    .input-group { margin-bottom: 10px; }
    .input-group label, .input-grid label { display: block; margin-bottom: 5px; }
    .input-group select, .input-grid input { width: 100%; padding: 5px; box-sizing: border-box; }
    .input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    #saveConfig { width: 100%; padding: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 15px; }
    
    /* Styles pour la section 5 jours */
    #fiveDayForecast { 
      margin: 20px auto; 
      padding: 15px; 
      background-color: rgba(255,255,255,0.8); 
      border-radius: 8px; 
      max-width: 600px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    #fiveDayForecast h3 { 
      text-align: center; 
      margin-bottom: 15px; 
      color: #333;
    }
    .day-forecast { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      padding: 10px; 
      margin-bottom: 8px; 
      border-radius: 5px; 
      background-color: #f9f9f9;
    }
    .day-name { 
      font-weight: bold; 
      min-width: 100px;
    }
    .risk-indicator { 
      font-size: 24px; 
      min-width: 40px; 
      text-align: center;
    }
    .risk-text { 
      flex-grow: 1; 
      text-align: right;
      font-size: 14px;
    }
  `;
  document.head.appendChild(style);

  document.body.insertBefore(configDiv, document.body.firstChild);

  const configButton = document.getElementById("configButton");
  const configPanel = document.getElementById("configPanel");

  configPanel.style.display = "none";

  configButton.addEventListener("click", (e) => {
    e.stopPropagation();
    if (
      configPanel.style.display === "none" ||
      configPanel.style.display === ""
    ) {
      configPanel.style.display = "block";
    } else {
      configPanel.style.display = "none";
    }
  });

  document.addEventListener("click", (event) => {
    if (
      !configDiv.contains(event.target) &&
      configPanel.style.display === "block"
    ) {
      configPanel.style.display = "none";
    }
  });

  const enableLocal = document.getElementById("enableLocal");
  const localSettings = document.getElementById("localSettings");
  const envType = document.getElementById("envType");
  const saveConfig = document.getElementById("saveConfig");

  enableLocal.addEventListener("change", () => {
    localSettings.style.display = enableLocal.checked ? "block" : "none";
  });

  envType.addEventListener("change", () => {
    const tempAdjust = document.getElementById("tempAdjust");
    const humidityAdjust = document.getElementById("humidityAdjust");
    switch (envType.value) {
      case "wooded":
        tempAdjust.value = "-1.5";
        humidityAdjust.value = "5";
        break;
      case "urban":
        tempAdjust.value = "0.5";
        humidityAdjust.value = "-5";
        break;
      case "rural":
        tempAdjust.value = "-1.0";
        humidityAdjust.value = "0";
        break;
    }
  });

  saveConfig.addEventListener("click", () => {
    CONFIG.localEnvironment.enabled = enableLocal.checked;
    CONFIG.localEnvironment.tempAdjustment = parseFloat(
      document.getElementById("tempAdjust").value
    );
    CONFIG.localEnvironment.humidityAdjustment = parseInt(
      document.getElementById("humidityAdjust").value
    );
    CONFIG.localEnvironment.name =
      { wooded: "Zone boisée", urban: "Zone urbaine", rural: "Zone rurale" }[
        envType.value
      ] || "Personnalisé";
    configPanel.style.display = "none";
    if (lastWeatherData && lastCityName)
      processMetNoWeatherData(lastWeatherData, lastCityName);
  });
}

// Initialisation
window.onload = function () {
  const messageElement = document.getElementById("message");
  messageElement.textContent = "Chargement en cours...";

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: false,
      timeout: 30000,
      maximumAge: 60000,
    });
  } else {
    messageElement.textContent =
      "⚠️ Votre navigateur ne supporte pas la géolocalisation.";
  }
  addConfigButton();
};

// Gestion de la géolocalisation réussie
function success(position) {
  const messageElement = document.getElementById("message");
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  messageElement.textContent = "Récupération des données météo...";
  console.log(`Position obtenue : lat=${latitude}, lon=${longitude}`);

  const weatherUrl = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${latitude}&lon=${longitude}`;
  const reverseGeoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`;

  fetch(weatherUrl)
    .then((res) => {
      console.log(`MET Norway status : ${res.status}`);
      if (!res.ok)
        throw new Error(`MET Norway erreur : ${res.status} ${res.statusText}`);
      return res.json();
    })
    .then((weatherData) => {
      messageElement.textContent = "Récupération du nom de la ville...";
      console.log("Données météo récupérées avec succès");
      return fetch(reverseGeoUrl)
        .then((res) => {
          console.log(`Nominatim status : ${res.status}`);
          if (!res.ok) {
            console.warn(
              "Nominatim a échoué, utilisation des coordonnées comme fallback"
            );
            throw new Error(
              `Nominatim erreur : ${res.status} ${res.statusText}`
            );
          }
          return res.json();
        })
        .then((cityData) => {
          const cityName =
            cityData.address.city ||
            cityData.address.town ||
            cityData.address.village ||
            `Lieu inconnu (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`;
          console.log(`Ville détectée : ${cityName}`);
          processMetNoWeatherData(weatherData, cityName);
        })
        .catch((error) => {
          console.warn(
            `Erreur Nominatim : ${error.message}. Utilisation des coordonnées brutes.`
          );
          const fallbackCityName = `Lieu inconnu (${latitude.toFixed(
            2
          )}, ${longitude.toFixed(2)})`;
          processMetNoWeatherData(weatherData, fallbackCityName);
        });
    })
    .catch((error) => {
      console.error(`Erreur lors de la récupération : ${error.message}`);
      messageElement.textContent = `⚠️ Erreur : ${error.message}. Rafraîchissez la page ou vérifiez votre connexion.`;
    });
}

// Traitement des données météo
function processMetNoWeatherData(data, cityName) {
  lastWeatherData = data;
  lastCityName = cityName;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const forecast = data.properties.timeseries
    .filter((item) => {
      const itemDate = new Date(item.time);
      return (
        itemDate.getDate() === tomorrow.getDate() &&
        itemDate.getHours() >= 2 &&
        itemDate.getHours() <= 8
      );
    })
    .sort((a, b) => new Date(a.time) - new Date(b.time));

  if (forecast.length === 0) {
    document.getElementById("message").textContent =
      "⚠️ Aucune prévision disponible pour demain matin.";
    return;
  }

  const target6am = new Date(tomorrow);
  target6am.setHours(6, 0, 0, 0);
  const forecastAt6h = forecast.reduce((prev, curr) => {
    const prevDiff = Math.abs(new Date(prev.time) - target6am);
    const currDiff = Math.abs(new Date(curr.time) - target6am);
    return prevDiff < currDiff ? prev : curr;
  });

  const formattedDate = tomorrow.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const riskAssessment = assessFrostRisk(forecast, cityName);

  updateUI(forecastAt6h, formattedDate, riskAssessment, cityName, target6am);
  drawCharts(forecast);
  
  // Nouvelle fonctionnalité : prévisions 5 jours
  displayFiveDayForecast(data);
}

// Nouvelle fonction : Prévisions sur 5 jours
console.log("displayFiveDayForecast appelée");
console.log("Nombre de données:", data.properties.timeseries.length);
function displayFiveDayForecast(data) {
  const fiveDayContainer = document.getElementById("fiveDayForecast");
  if (!fiveDayContainer) return;

  let forecastHTML = '<h3>📅 Risque de givre - 5 prochains jours</h3>';

  for (let dayOffset = 1; dayOffset <= 5; dayOffset++) {
    const targetDay = new Date();
    targetDay.setDate(targetDay.getDate() + dayOffset);
    targetDay.setHours(0, 0, 0, 0);

    // Filtrer les données pour ce jour entre 2h et 8h
    const dayForecast = data.properties.timeseries.filter((item) => {
      const itemDate = new Date(item.time);
      return (
        itemDate.getDate() === targetDay.getDate() &&
        itemDate.getMonth() === targetDay.getMonth() &&
        itemDate.getHours() >= 2 &&
        itemDate.getHours() <= 8
      );
    });

    if (dayForecast.length === 0) continue;

    // Évaluer le risque pour ce jour
    const riskLevel = evaluateDayRisk(dayForecast);
    const dayName = targetDay.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "short",
    });

    let icon = "🌞";
    let riskText = "Pas de risque";
    let bgColor = "#f0f8f0";

    if (riskLevel === 1) {
      icon = "❄️";
      riskText = "Risque potentiel";
      bgColor = "#e6f2ff";
    } else if (riskLevel === 2) {
      icon = "⚠️❄️";
      riskText = "Risque important";
      bgColor = "#fff0e6";
    } else if (riskLevel === 3) {
      icon = "⚠️❄️❄️";
      riskText = "Risque très élevé";
      bgColor = "#ffe6e6";
    }

    forecastHTML += `
      <div class="day-forecast" style="background-color: ${bgColor};">
        <span class="day-name">${dayName}</span>
        <span class="risk-indicator">${icon}</span>
        <span class="risk-text">${riskText}</span>
      </div>
    `;
  }

  fiveDayContainer.innerHTML = forecastHTML;
}

// Fonction auxiliaire pour évaluer le risque d'un jour
function evaluateDayRisk(forecast) {
  let maxRiskLevel = 0;

  const tempAdjustment = CONFIG.localEnvironment.enabled
    ? CONFIG.localEnvironment.tempAdjustment
    : 0;
  const humidityAdjustment = CONFIG.localEnvironment.enabled
    ? CONFIG.localEnvironment.humidityAdjustment
    : 0;

  forecast.forEach((item) => {
    const data = item.data.instant.details;
    const adjustedTemp = data.air_temperature + tempAdjustment;
    const adjustedHumidity = Math.min(
      100,
      data.relative_humidity + humidityAdjustment
    );
    const windSpeed = data.wind_speed * 3.6;

    // Calcul du point de rosée
    const b = 17.27;
    const c = 237.7;
    const alpha =
      (b * adjustedTemp) / (c + adjustedTemp) +
      Math.log(adjustedHumidity / 100);
    const dewPoint = (c * alpha) / (b - alpha);

    let cloudCoverage =
      item.data.next_1_hours?.details?.cloud_area_fraction ??
      data.cloud_area_fraction;

    // Niveau 3 : Risque très élevé
    if (
      adjustedTemp <= 0 &&
      dewPoint >= adjustedTemp - 1 &&
      (cloudCoverage === undefined || cloudCoverage < 30)
    ) {
      maxRiskLevel = 3;
    }
    // Niveau 2 : Risque important
    else if (
      adjustedTemp <= 1 &&
      dewPoint >= adjustedTemp - 2 &&
      (cloudCoverage === undefined || cloudCoverage < 50)
    ) {
      maxRiskLevel = Math.max(maxRiskLevel, 2);
    }
    // Niveau 1 : Risque potentiel
    else if (
      adjustedTemp <= 2.5 &&
      dewPoint >= adjustedTemp - 2 &&
      windSpeed <= 10 &&
      (cloudCoverage === undefined || cloudCoverage < 70)
    ) {
      maxRiskLevel = Math.max(maxRiskLevel, 1);
    }
  });

  return maxRiskLevel;
}

// Évaluation du risque de givre avec point de rosée et couverture nuageuse
function assessFrostRisk(forecast, cityName) {
  let maxRiskLevel = 0;
  let riskMessage = `<span style="color: red;">🌞 NON 🌞<br><br>Pas de risque de givre à ${cityName}<br></span>`;
  let bgColor = "#ffe5b4";

  const tempAdjustment = CONFIG.localEnvironment.enabled
    ? CONFIG.localEnvironment.tempAdjustment
    : 0;
  const humidityAdjustment = CONFIG.localEnvironment.enabled
    ? CONFIG.localEnvironment.humidityAdjustment
    : 0;

  let minTemp = 100,
    maxHumidity = 0,
    minWindSpeed = 100,
    minCloudCoverage = 100,
    minDewPoint = 100;
  let criticalTimepoint = null,
    hasValidCloudData = false;

  forecast.forEach((item) => {
    const data = item.data.instant.details;
    const adjustedTemp = data.air_temperature + tempAdjustment;
    const adjustedHumidity = Math.min(
      100,
      data.relative_humidity + humidityAdjustment
    );
    const windSpeed = data.wind_speed * 3.6;

    // Calcul du point de rosée (formule de Magnus simplifiée)
    const b = 17.27;
    const c = 237.7;
    const alpha =
      (b * adjustedTemp) / (c + adjustedTemp) +
      Math.log(adjustedHumidity / 100);
    const dewPoint = (c * alpha) / (b - alpha);

    let cloudCoverage =
      item.data.next_1_hours?.details?.cloud_area_fraction ??
      data.cloud_area_fraction;
    if (cloudCoverage !== undefined) {
      hasValidCloudData = true;
      minCloudCoverage = Math.min(minCloudCoverage, cloudCoverage);
    }

    minTemp = Math.min(minTemp, adjustedTemp);
    maxHumidity = Math.max(maxHumidity, adjustedHumidity);
    minWindSpeed = Math.min(minWindSpeed, windSpeed);
    minDewPoint = Math.min(minDewPoint, dewPoint);

    // Niveau 3 : Risque très élevé
    if (
      adjustedTemp <= 0 &&
      dewPoint >= adjustedTemp - 1 &&
      (cloudCoverage === undefined || cloudCoverage < 30)
    ) {
      maxRiskLevel = 3;
      criticalTimepoint = item.time;
    }
    // Niveau 2 : Risque important
    else if (
      adjustedTemp <= 1 &&
      dewPoint >= adjustedTemp - 2 &&
      (cloudCoverage === undefined || cloudCoverage < 50)
    ) {
      maxRiskLevel = Math.max(maxRiskLevel, 2);
      criticalTimepoint = criticalTimepoint || item.time;
    }
    // Niveau 1 : Risque potentiel (seuil relevé à 2,5°C)
    else if (
      adjustedTemp <= 2.5 &&
      dewPoint >= adjustedTemp - 2 &&
      windSpeed <= 10 &&
      (cloudCoverage === undefined || cloudCoverage < 70)
    ) {
      maxRiskLevel = Math.max(maxRiskLevel, 1);
      criticalTimepoint = criticalTimepoint || item.time;
    }
  });

  // Analyse détaillée
  let detailedReason = `
    <div style="margin-top: 10px;">
      <strong>Analyse détaillée</strong>
      ${
        CONFIG.localEnvironment.enabled
          ? `<div>Ajustements (${CONFIG.localEnvironment.name}): ${tempAdjustment}°C / ${humidityAdjustment}%</div>`
          : ""
      }
      <ul style="list-style-type: none; padding-left: 0;">
        <li>Temp. min: ${minTemp.toFixed(1)}°C</li>
        <li>Humidité max: ${maxHumidity.toFixed(0)}%</li>
        <li>Point de rosée min: ${minDewPoint.toFixed(1)}°C</li>
        <li>Vent min: ${minWindSpeed.toFixed(1)} km/h</li>
        ${
          hasValidCloudData
            ? `<li>Couv. nuageuse min: ${minCloudCoverage.toFixed(0)}%</li>`
            : ""
        }
      </ul>
    </div>
  `;

  switch (maxRiskLevel) {
    case 1:
      riskMessage = `<span style="color: green;">❄️ OUI ❄️<br><br>Risque potentiel de givre à ${cityName}<br></span>`;
      bgColor = "#d0e7ff";
      break;
    case 2:
      riskMessage = `<span style="color: purple;">⚠️❄️ OUI : VIGILANCE ❄️⚠️<br><br>Risque important de givre à ${cityName}<br></span>`;
      bgColor = "#e6e6fa";
      break;
    case 3:
      riskMessage = `<span style="color: darkred; font-weight: bold;">⚠️❄️❄️ OUI : ALERTE GIVRE ❄️❄️⚠️<br><br>Risque très élevé de givre à ${cityName}<br></span>`;
      bgColor = "#ffcccc";
      break;
  }

  riskMessage += detailedReason;
  return { message: riskMessage, backgroundColor: bgColor };
}

// Mise à jour de l'interface
function updateUI(
  forecast,
  formattedDate,
  riskAssessment,
  cityName,
  target6am
) {
  lastForecastAt6h = forecast;
  lastFormattedDate = formattedDate;
  lastTarget6am = target6am;

  const messageElement = document.getElementById("message");
  const forecastTime = new Date(forecast.time);
  const timeStr = `${forecastTime.getHours()}h${String(
    forecastTime.getMinutes()
  ).padStart(2, "0")}`;
  const diffWith6am = Math.abs(forecastTime - target6am) / (1000 * 60);
  const timeNote =
    diffWith6am > 30 ? `<br><em>(Prévision la plus proche de 6h00)</em>` : "";

  const data = forecast.data.instant.details;
  const cloudCoverageText =
    forecast.data.next_1_hours?.details?.cloud_area_fraction?.toFixed(0) ??
    data.cloud_area_fraction?.toFixed(0) ??
    "N/A";

  document.body.style.backgroundColor = riskAssessment.backgroundColor;
  messageElement.innerHTML = `
    ${riskAssessment.message}<br>
    <strong>Prévisions pour ${formattedDate} à ${timeStr}</strong>${timeNote}<br><br>
    Température : ${data.air_temperature.toFixed(1)}°C<br>
    Humidité : ${data.relative_humidity.toFixed(0)}%<br>
    Vent : ${(data.wind_speed * 3.6).toFixed(1)} km/h<br>
    Couverture nuageuse : ${cloudCoverageText}${
    cloudCoverageText !== "N/A" ? "%" : ""
  }
  `;
}

// Dessin des graphiques
function drawCharts(weatherData) {
  const transformedData = weatherData.map((item) => ({
    time: item.time,
    temp: item.data.instant.details.air_temperature,
    humidity: item.data.instant.details.relative_humidity,
    windSpeed: item.data.instant.details.wind_speed * 3.6,
    cloudCoverage:
      item.data.next_1_hours?.details?.cloud_area_fraction ??
      item.data.instant.details.cloud_area_fraction ??
      0,
  }));

  const labels = transformedData.map((item) => {
    const date = new Date(item.time);
    return `${date.getHours()}h${String(date.getMinutes()).padStart(2, "0")}`;
  });

  const charts = [
    {
      id: "tempChart",
      label: "Température (°C)",
      data: (item) => item.temp,
      color: "red",
      title: "Évolution température",
    },
    {
      id: "humidityChart",
      label: "Humidité (%)",
      data: (item) => item.humidity,
      color: "blue",
      title: "Évolution humidité",
      min: 0,
      max: 100,
    },
    {
      id: "windChart",
      label: "Vent (km/h)",
      data: (item) => item.windSpeed,
      color: "green",
      title: "Évolution vent",
    },
    {
      id: "cloudChart",
      label: "Couv. nuageuse (%)",
      data: (item) => item.cloudCoverage,
      color: "orange",
      title: "Évolution couv. nuageuse",
      min: 0,
      max: 100,
    },
  ];

  charts.forEach((chart) => {
    const ctx = document.getElementById(chart.id)?.getContext("2d");
    if (ctx) {
      new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: chart.label,
              data: transformedData.map(chart.data),
              borderColor: chart.color,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: chart.title,
              font: {
                size: 22,
                family: "Arial",
                weight: "bold",
              },
              padding: 10,
            },
          },
          scales: { y: { min: chart.min, max: chart.max } },
        },
      });
    }
  });
}

// Gestion des erreurs
function error(err) {
  const messageElement = document.getElementById("message");
  let errorMessage = "⚠️ Erreur inconnue.";
  switch (err.code) {
    case 1:
      errorMessage = "⚠️ Localisation refusée. Activez-la dans les réglages.";
      break;
    case 2:
      errorMessage = "⚠️ Position indisponible. Vérifiez votre GPS.";
      break;
    case 3:
      errorMessage = "⚠️ Temps d'attente dépassé. Réessayez.";
      break;
  }
  messageElement.textContent = errorMessage;
}
