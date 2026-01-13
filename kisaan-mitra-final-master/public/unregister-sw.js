// Unregister any existing service workers
// This fixes the "Failed to convert value to 'Response'" error

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for (let registration of registrations) {
      registration.unregister();
      console.log('Service worker unregistered:', registration);
    }
  });
}
