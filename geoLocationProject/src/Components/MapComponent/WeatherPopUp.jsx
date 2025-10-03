import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import { motion } from "framer-motion";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "./WeatherPopUp.css";

// Fix default marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function WeatherPopup({ location, weather }) {
  const map = useMap();

  // Move map to the given location when component loads
  useEffect(() => {
    if (location) {
      map.setView(location, 10, { animate: true });
    }
  }, [location, map]);

  if (!weather) return null;

  const { name, coord, main, weather: weatherDetails, wind } = weather;
  const { icon, description, main: condition } = weatherDetails[0];

  // 🎨 Enhanced theme logic based on icon
  const getThemeClass = (icon) => {
    if (icon.includes("01")) return "sunnyTheme";
    if (icon.includes("02") || icon.includes("03") || icon.includes("04")) return "cloudyTheme";
    if (icon.includes("09") || icon.includes("10")) return "rainyTheme";
    if (icon.includes("11")) return "stormTheme";
    if (icon.includes("13")) return "snowTheme";
    if (icon.includes("50")) return "fogTheme";
    return "defaultTheme";
  };

  const themeClass = getThemeClass(icon);

  // Get weather emoji based on condition
  const getWeatherEmoji = (icon) => {
    if (icon.includes("01")) return "☀️";
    if (icon.includes("02") || icon.includes("03")) return "⛅";
    if (icon.includes("04")) return "☁️";
    if (icon.includes("09") || icon.includes("10")) return "🌧️";
    if (icon.includes("11")) return "⛈️";
    if (icon.includes("13")) return "❄️";
    if (icon.includes("50")) return "🌫️";
    return "🌤️";
  };

  return (
    <Marker position={location}>
      <Popup>
        <motion.div
          className={`popupCard ${themeClass}`}
          initial={{ opacity: 0, scale: 0.3, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 20,
            duration: 0.6 
          }}
        >
          {/* Header */}
          <div className="popupHeader">
            <motion.div 
              className="headerIcon"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              {getWeatherEmoji(icon)}
            </motion.div>
            <h3 className="popupTitle">Weather Report</h3>
          </div>

          {/* City Name */}
          <motion.div 
            className="cityName"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            📍 {name}
          </motion.div>

          {/* Main Weather Info */}
          <div className="weatherMain">
            <div className="tempSection">
              <motion.div 
                className="mainTemp"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                {Math.round(main.temp)}°C
              </motion.div>
              <div className="feelsLike">
                Feels like {Math.round(main.feels_like)}°C
              </div>
            </div>

            <motion.div 
              className="weatherIcon"
              animate={{ 
                y: [0, -8, 0],
                rotate: [0, 5, -5, 0] 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3,
                ease: "easeInOut" 
              }}
            >
              <img
                src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
                alt={description}
                className="iconStyle"
              />
            </motion.div>
          </div>

          {/* Weather Description */}
          <motion.div 
            className="conditionPara"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {condition} - {description}
          </motion.div>

          {/* Weather Details Grid */}
          <motion.div 
            className="weatherGrid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="weatherDetail">
              <span className="detailIcon">💧</span>
              <div>
                <div className="detailLabel">Humidity</div>
                <div className="detailValue">{main.humidity}%</div>
              </div>
            </div>

            <div className="weatherDetail">
              <span className="detailIcon">🌡️</span>
              <div>
                <div className="detailLabel">Pressure</div>
                <div className="detailValue">{main.pressure} hPa</div>
              </div>
            </div>

            {wind && (
              <div className="weatherDetail">
                <span className="detailIcon">💨</span>
                <div>
                  <div className="detailLabel">Wind Speed</div>
                  <div className="detailValue">{wind.speed} m/s</div>
                </div>
              </div>
            )}

            <div className="weatherDetail">
              <span className="detailIcon">🧭</span>
              <div>
                <div className="detailLabel">Coordinates</div>
                <div className="detailValue">{coord.lat.toFixed(2)}, {coord.lon.toFixed(2)}</div>
              </div>
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <div className="decorativeElements">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="floatingParticle"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2 + i * 0.5,
                  delay: i * 0.3,
                }}
                style={{
                  left: `${15 + i * 12}%`,
                  top: `${10 + (i % 2) * 60}%`,
                }}
              />
            ))}
          </div>
        </motion.div>
      </Popup>
    </Marker>
  );
}