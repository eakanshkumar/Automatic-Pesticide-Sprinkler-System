import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const FarmMap = ({ farms, onFarmSelect }) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (map && farms.length > 0) {
      const group = new L.featureGroup(
        farms.map(farm => {
          if (farm.location?.coordinates) {
            return L.marker([
              farm.location.coordinates.lat,
              farm.location.coordinates.lng
            ]);
          }
          return null;
        }).filter(Boolean)
      );
      
      if (group.getLayers().length > 0) {
        map.fitBounds(group.getBounds().pad(0.1));
      }
    }
  }, [map, farms]);

  const getColorByStatus = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'gray';
      case 'maintenance': return 'orange';
      default: return 'blue';
    }
  };

  return (
    <div className="h-full w-full">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        whenCreated={setMap}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {farms.map((farm) => {
          if (!farm.location?.coordinates) return null;
          
          return (
            <React.Fragment key={farm._id}>
              <Marker
                position={[farm.location.coordinates.lat, farm.location.coordinates.lng]}
                eventHandlers={{
                  click: () => onFarmSelect && onFarmSelect(farm)
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold">{farm.name}</h3>
                    <p className="text-sm text-gray-600">
                      {farm.size} hectares
                    </p>
                    {farm.crops && farm.crops.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium">Crops:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {farm.crops.map((crop, index) => (
                            <span
                              key={index}
                              className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                            >
                              {crop}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>

              {/* Render farm fields as polygons */}
              {farm.fields?.map((field, fieldIndex) => (
                <Polygon
                  key={fieldIndex}
                  positions={field.coordinates.map(coord => [coord.lat, coord.lng])}
                  pathOptions={{
                    color: getColorByStatus(field.status),
                    fillOpacity: 0.2,
                  }}
                />
              ))}
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default FarmMap;