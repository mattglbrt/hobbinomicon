// src/scripts/autoAuth.js

if (window.location.pathname.startsWith('/admin')) {
    const originalFetch = window.fetch;
  
    window.fetch = async (...args) => {
      let [resource, config = {}] = args;
  
      const password = sessionStorage.getItem('hobbinomiconAdminPassword');
  
      if (password) {
        // Add Authorization header with the Bearer token
        config.headers = {
          ...(config.headers || {}),
          Authorization: `Bearer ${password}`,
        };
      }
  
      return originalFetch(resource, config);
    };
}
