import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { useRef, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import WeatherPopUp from "./WeatherPopUp";


// Fix default marker icon issue in React
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function LocationMarker() {
  const [position, setPosition] = useState(null);
  const [weather, setWeather] = useState(null);
  const markerRef = useRef(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;   // ✅ use event lat/lng directly
      setPosition([lat, lng]);
      const api_key = "246ec31602cb3c1bb1c79d17df8f6d9a";
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${api_key}&units=metric`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Weather Data:", data);
          setWeather(data);
        })
        .catch((err) => console.error("Error:", err));
    },
  });

  // Auto open popup after weather is fetched
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [weather]);

  return position ? (
    <Marker position={position}>
      <Popup>
        {weather && 
          <WeatherPopUp
            location={[weather.coord.lat, weather.coord.lon]}
            weather={weather}
          />
         }
      </Popup>
    </Marker>
  ) : null;
}

export default function MapComponent() {
  return (
    <MapContainer
      center={[20.5937, 78.9629]} // India lat/lng
      zoom={10}
      style={{ height: "100vh", width: "100%" }}
      preferCanvas:true
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
}
