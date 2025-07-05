(function () {
  const SUPABASE_URL = 'https://uyzmxzjdnnerroiojmao.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5em14empkbm5lcnJvaW9qbWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MTkwOTgsImV4cCI6MjA2NzI5NTA5OH0.DYy8Vos2p2A9ollMdGGJCsumYWiqb15hIZFyAy-Hbiw';
  const apiKey = document.currentScript.getAttribute('data-api-key');
  
  console.log('[SocialProof] Script starting with API key:', apiKey);
  
  // Add toast styles
  const toastStyles = document.createElement('style');
  toastStyles.innerHTML = `
    .sps-toast {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #000;
      color: #fff;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      font-family: sans-serif;
      z-index: 9999;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.4s ease;
      max-width: 300px;
    }
    .sps-toast.show {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(toastStyles);
  
  function showToast(message) {
    console.log('[SocialProof] Showing toast:', message);
    const toast = document.createElement('div');
    toast.className = 'sps-toast';
    toast.innerText = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 5000);
  }
  
  console.log('[SocialProof] Testing toast...');
  showToast('Social proof script loaded successfully!');
  
  const scriptTag = document.createElement('script');
  scriptTag.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  scriptTag.onload = () => {
    console.log('[SocialProof] Supabase script loaded');
    
    try {
      const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log('[SocialProof] Supabase client created:', supabase);
      
      // Listen to broadcast messages
      console.log('[SocialProof] Setting up broadcast subscription...');
      
      const channel = supabase
        .channel('social-proof-events')
        .on(
          'broadcast',
          { event: 'social-proof-event' },
          (payload) => {
            console.log('[SocialProof] Broadcast received:', payload);
            
            // Use custom message if provided, otherwise fallback to default format
            let displayMessage;
            if (payload.payload.message) {
              displayMessage = payload.payload.message;
            } else {
              // Fallback to original format
              const { event_type, event_data } = payload.payload;
              const name = event_data?.name || 'Someone';
              displayMessage = `${name} just did: ${event_type}`;
            }
            
            showToast(displayMessage);
          }
        )
        .subscribe((status) => {
          console.log('[SocialProof] Subscription status:', status);
          switch (status) {
            case 'SUBSCRIBED':
              console.log('[SocialProof] Successfully subscribed to broadcast events');
              break;
            case 'CHANNEL_ERROR':
              console.error('[SocialProof] Error subscribing to channel');
              break;
            case 'TIMED_OUT':
              console.error('[SocialProof] Subscription timed out');
              break;
            case 'CLOSED':
              console.log('[SocialProof] Subscription closed');
              break;
          }
        });
      
    } catch (error) {
      console.error('[SocialProof] Error initializing Supabase:', error);
    }
  };
  
  scriptTag.onerror = () => {
    console.error('[SocialProof] Failed to load Supabase script');
  };
  
  document.head.appendChild(scriptTag);
})();