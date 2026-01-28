/* eslint-disable */
import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Circle,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

// 🔹 MANUAL TEST HELPERS (fake data)
const helpers = [
  {
    id: 1,
    name: "Helper A",
    service: "Electrician",
    lat: 26.5050,
    lng: 83.7810,
  },
  {
    id: 2,
    name: "Helper B",
    service: "Plumber",
    lat: 26.4985,
    lng: 83.7700,
  },
  {
    id: 3,
    name: "Helper C",
    service: "Carpenter",
    lat: 26.5300,
    lng: 83.8000, // thoda door
  },
];

// 🔹 Distance calculate (Haversine formula)
const getDistanceInKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function LiveMap() {
  const [location, setLocation] = useState(null);
  const [accuracy, setAccuracy] = useState(null);

  useEffect(() => {
    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setAccuracy(pos.coords.accuracy);
      },
      (err) => console.error(err),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 20000,
      }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  // 🔹 Filter helpers within 5 km
  const nearbyHelpers =
    location &&
    helpers.filter((h) => {
      const dist = getDistanceInKm(
        location.lat,
        location.lng,
        h.lat,
        h.lng
      );
      return dist <= 5; // 5 KM radius
    });

  return (
    <div style={{ padding: 20 }}>
      <h2>Nearby Helpers (5 KM)</h2>

      {!location && <p>Waiting for GPS location…</p>}

      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
        {location && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={location}
            zoom={14}
          >
            {/* User Marker */}
            <Marker position={location} label="You" />

            {/* 5 KM Radius Circle */}
            <Circle
              center={location}
              radius={5000}
              options={{
                strokeColor: "#1976d2",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#1976d2",
                fillOpacity: 0.15,
              }}
            />

            {/* Helper Markers */}
            {nearbyHelpers &&
              nearbyHelpers.map((h) => (
                <Marker
                  key={h.id}
                  position={{ lat: h.lat, lng: h.lng }}
                  label={h.name}
                />
              ))}
          </GoogleMap>
        )}
      </LoadScript>

      {/* Helper List */}
      {nearbyHelpers && (
        <div style={{ marginTop: 10 }}>
          <h3>Helpers in 5 KM</h3>
          {nearbyHelpers.map((h) => {
            const dist = getDistanceInKm(
              location.lat,
              location.lng,
              h.lat,
              h.lng
            );
            return (
              <p key={h.id}>
                {h.name} ({h.service}) – {dist.toFixed(2)} km
              </p>
            );
          })}
        </div>
      )}

      {accuracy && (
        <p>GPS accuracy: ~{Math.round(accuracy)} meters</p>
      )}
    </div>
  );
}
