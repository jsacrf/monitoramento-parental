"use client";

import { X, MapPin, Navigation, Clock, Locate } from "lucide-react";
import { Location } from "../types";
import { useEffect, useRef, useState } from "react";

interface LocationMapModalProps {
  childName: string;
  location?: Location;
  onClose: () => void;
}

export function LocationMapModal({
  childName,
  location,
  onClose,
}: LocationMapModalProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location | undefined>(location);
  const [isTracking, setIsTracking] = useState(false);

  // Carregar Google Maps API (apenas uma vez globalmente)
  useEffect(() => {
    const loadGoogleMaps = () => {
      // Se o Google Maps já está carregado
      if (typeof window.google !== "undefined" && window.google.maps) {
        setIsLoading(false);
        return;
      }

      // Verificar se já existe um script do Google Maps (busca mais rigorosa)
      const existingScript = Array.from(document.getElementsByTagName('script')).find(
        script => script.src.includes('maps.googleapis.com/maps/api/js')
      );
      
      if (existingScript) {
        // Script já existe, aguardar carregamento
        const checkGoogleLoaded = setInterval(() => {
          if (typeof window.google !== "undefined" && window.google.maps) {
            setIsLoading(false);
            clearInterval(checkGoogleLoaded);
          }
        }, 100);
        
        // Timeout de segurança
        setTimeout(() => {
          clearInterval(checkGoogleLoaded);
          setIsLoading(false);
        }, 5000);
        return;
      }

      // Criar novo script apenas se não existir
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&libraries=places`;
      script.async = true;
      script.defer = true;
      script.id = "google-maps-script"; // ID único para identificação
      script.onload = () => {
        setIsLoading(false);
      };
      script.onerror = () => {
        setIsLoading(false);
        console.error("Erro ao carregar Google Maps");
      };
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Inicializar mapa
  useEffect(() => {
    if (!isLoading && mapRef.current && !map && typeof window.google !== "undefined") {
      const initialLocation = currentLocation || {
        latitude: -23.5505,
        longitude: -46.6333,
        timestamp: Date.now(),
      };

      const googleMap = new google.maps.Map(mapRef.current, {
        center: { lat: initialLocation.latitude, lng: initialLocation.longitude },
        zoom: 15,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
      });

      const googleMarker = new google.maps.Marker({
        position: { lat: initialLocation.latitude, lng: initialLocation.longitude },
        map: googleMap,
        title: childName,
        animation: google.maps.Animation.DROP,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#10b981",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 3,
        },
      });

      setMap(googleMap);
      setMarker(googleMarker);
    }
  }, [isLoading, map, currentLocation, childName]);

  // Atualizar posição do marcador
  useEffect(() => {
    if (map && marker && currentLocation) {
      const position = { lat: currentLocation.latitude, lng: currentLocation.longitude };
      marker.setPosition(position);
      map.panTo(position);
    }
  }, [currentLocation, map, marker]);

  // Rastreamento em tempo real
  const startTracking = () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não é suportada pelo seu navegador");
      return;
    }

    setIsTracking(true);

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: Date.now(),
        };
        setCurrentLocation(newLocation);

        // Buscar endereço via Geocoding
        if (typeof window.google !== "undefined") {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode(
            { location: { lat: newLocation.latitude, lng: newLocation.longitude } },
            (results, status) => {
              if (status === "OK" && results && results[0]) {
                setCurrentLocation({
                  ...newLocation,
                  address: results[0].formatted_address,
                });
              }
            }
          );
        }
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      setIsTracking(false);
    };
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                Localização de {childName}
              </h2>
              <p className="text-white/90 text-sm">
                Rastreamento GPS em tempo real
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {!currentLocation ? (
            <div className="flex items-center justify-center h-full p-12">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium mb-2">
                  Localização não disponível
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  Clique em "Ativar Rastreamento" para começar
                </p>
                <button
                  onClick={startTracking}
                  disabled={isTracking}
                  className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  {isTracking ? "Rastreando..." : "Ativar Rastreamento"}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Info Card */}
              <div className="p-6 bg-gradient-to-br from-green-50 to-teal-50 border-b-2 border-green-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                        <Navigation className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">
                          Coordenadas
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                          {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">
                          Última atualização
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                          {new Date(currentLocation.timestamp).toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {currentLocation.address && (
                  <div className="mt-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-600 font-medium mb-1">
                          Endereço
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                          {currentLocation.address}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mapa */}
              <div className="relative h-96 bg-gray-100">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600 font-medium">
                        Carregando Google Maps...
                      </p>
                    </div>
                  </div>
                ) : (
                  <div ref={mapRef} className="w-full h-full"></div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex gap-3 flex-wrap">
            {currentLocation && !isTracking && (
              <button
                onClick={startTracking}
                className="flex-1 min-w-[200px] bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-4 rounded-2xl font-bold hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Locate className="w-5 h-5" />
                Ativar Rastreamento
              </button>
            )}
            {isTracking && (
              <button
                onClick={() => setIsTracking(false)}
                className="flex-1 min-w-[200px] bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-4 rounded-2xl font-bold hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Locate className="w-5 h-5 animate-pulse" />
                Parar Rastreamento
              </button>
            )}
            {currentLocation && (
              <button
                onClick={() => {
                  const url = `https://www.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`;
                  window.open(url, "_blank");
                }}
                className="px-6 py-4 bg-blue-100 text-blue-700 rounded-2xl font-bold hover:bg-blue-200 transition-all duration-200"
              >
                Abrir no Google Maps
              </button>
            )}
            <button
              onClick={onClose}
              className="px-6 py-4 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-all duration-200"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
