// Gerenciador global do Google Maps API
let isLoading = false;
let isLoaded = false;
const callbacks: Array<() => void> = [];

export function loadGoogleMaps(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Se já está carregado, resolve imediatamente
    if (isLoaded && typeof window.google !== "undefined") {
      resolve();
      return;
    }

    // Se está carregando, adiciona callback para quando terminar
    if (isLoading) {
      callbacks.push(resolve);
      return;
    }

    // Verifica se já existe o script
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      isLoaded = true;
      resolve();
      return;
    }

    // Inicia o carregamento
    isLoading = true;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      isLoaded = true;
      isLoading = false;
      resolve();
      
      // Executa todos os callbacks pendentes
      callbacks.forEach(cb => cb());
      callbacks.length = 0;
    };
    
    script.onerror = () => {
      isLoading = false;
      reject(new Error("Erro ao carregar Google Maps"));
    };
    
    document.head.appendChild(script);
  });
}

export function isGoogleMapsLoaded(): boolean {
  return isLoaded && typeof window.google !== "undefined";
}
