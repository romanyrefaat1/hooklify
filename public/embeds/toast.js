(function () {
  const SUPABASE_URL = 'https://uyzmxzjdnnerroiojmao.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5em14empkbm5lcnJvaW9qbWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MTkwOTgsImV4cCI6MjA2NzI5NTA5OH0.DYy8Vos2p2A9ollMdGGJCsumYWiqb15hIZFyAy-Hbiw';
  const apiKey = document.currentScript.getAttribute('data-api-key');
  
  console.log('[SocialProof] Script starting with API key:', apiKey);
  
  // Configuration
  const CONFIG = {
    CACHE_DURATION: 2 * 24 * 60 * 60 * 1000, // 2 days in milliseconds
    FALLBACK_EVENT_COUNT: 15,
    BURST_INTERVAL: 3 * 60 * 1000, // 3 minutes
    BURST_VARIANCE: 2 * 60 * 1000 // +/- 2 minutes
  };
  
  // State management
  let supabaseClient = null;
  let eventDisplayTimer = null;
  let burstModeTimer = null;
  let currentSiteId = null;
  let fallbackEvents = [];
  let lastShownEventIndex = -1;
  let isBurstMode = false;
  let burstEventCount = 0;
  let liveEventQueue = [];
  
  // Toast stacking management
  let activeToasts = [];
  
  // Add toast styles
  const toastStyles = document.createElement('style');
  toastStyles.innerHTML = `
    .sps-toast {
      position: fixed;
      right: 20px;
      background: #000;
      color: #fff;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      font-family: sans-serif;
      z-index: 9999;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.4s ease;
      max-width: 300px;
      margin-bottom: 10px;
    }
    .sps-toast.show {
      opacity: 1;
      transform: translateX(0);
    }
    .sps-toast.hide {
      opacity: 0;
      transform: translateX(100%);
    }
  `;
  document.head.appendChild(toastStyles);
  
  // Utility functions
  function updateToastPositions() {
    let bottomOffset = 20;
    
    // Update positions from bottom to top
    activeToasts.forEach((toast, index) => {
      toast.style.bottom = bottomOffset + 'px';
      bottomOffset += toast.offsetHeight + 10; // 10px gap between toasts
    });
  }
  
  function showToast(message) {
    console.log('[SocialProof] Showing toast:', message);
    const toast = document.createElement('div');
    toast.className = 'sps-toast';
    toast.innerText = message;
    document.body.appendChild(toast);
    
    // Add to active toasts array
    activeToasts.push(toast);
    
    // Update positions immediately
    updateToastPositions();
    
    // Show the toast
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    // Hide and remove the toast after 5 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      toast.classList.add('hide');
      
      setTimeout(() => {
        // Remove from active toasts array
        const index = activeToasts.indexOf(toast);
        if (index > -1) {
          activeToasts.splice(index, 1);
        }
        
        // Remove from DOM
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
        
        // Update positions of remaining toasts
        updateToastPositions();
      }, 400);
    }, 5000);
  }
  
  function getCleanApiKey() {
    if (!apiKey) return null;
    const cleaned = apiKey.startsWith('site_') ? apiKey.substring(5) : apiKey;
    console.log('[SocialProof] Original API key:', apiKey, 'Cleaned:', cleaned);
    return cleaned;
  }
  
  function getCacheKey() {
    return `social_proof_events_${getCleanApiKey()}`;
  }
  
  function saveEventsToCache(events, siteId) {
    const cacheData = {
      events,
      timestamp: Date.now(),
      siteId,
      lastShownIndex: -1
    };
    
    try {
      localStorage.setItem(getCacheKey(), JSON.stringify(cacheData));
      console.log('[SocialProof] Events cached successfully');
    } catch (error) {
      console.error('[SocialProof] Failed to cache events:', error);
    }
  }
  
  function loadEventsFromCache() {
    try {
      const cached = localStorage.getItem(getCacheKey());
      if (!cached) {
        console.log('[SocialProof] No cached events found');
        return null;
      }
      
      const cacheData = JSON.parse(cached);
      const now = Date.now();
      
      // Check if cache is still valid (within 2 days)
      if (now - cacheData.timestamp > CONFIG.CACHE_DURATION) {
        console.log('[SocialProof] Cache expired, will fetch fresh events');
        localStorage.removeItem(getCacheKey());
        return null;
      }
      
      console.log('[SocialProof] Loaded events from cache:', cacheData.events.length);
      return cacheData;
    } catch (error) {
      console.error('[SocialProof] Failed to load cached events:', error);
      return null;
    }
  }
  
  function getRandomDelay() {
    const isShortDelay = Math.random() < 0.5;
    if (isShortDelay) {
      return Math.random() * 4.5 + 0.5; // 0.5-5 seconds
    } else {
      return Math.random() * 10 + 5; // 5-15 seconds
    }
  }
  
  function getBurstDelay() {
    return Math.random() * 3 + 2; // 2-5 seconds
  }
  
  function getRandomFallbackEvent() {
    console.log('[SocialProof] Getting random fallback event. Available events:', fallbackEvents.length);
    
    if (fallbackEvents.length === 0) {
      console.log('[SocialProof] No fallback events available');
      return null;
    }
    
    // Avoid showing the same event consecutively
    let eventIndex;
    do {
      eventIndex = Math.floor(Math.random() * fallbackEvents.length);
    } while (eventIndex === lastShownEventIndex && fallbackEvents.length > 1);
    
    lastShownEventIndex = eventIndex;
    const event = fallbackEvents[eventIndex];
    console.log('[SocialProof] Selected event:', event);
    return event;
  }
  
  function formatEventMessage(event) {
    // Check if event has a custom message
    if (event.event_data && event.event_data.message) {
      return event.event_data.message;
    }
    
    // Fallback to default format
    const name = event.event_data?.name || 'Someone';
    return `${name} just did: ${event.event_type}`;
  }
  
  function displayNextEvent() {
    let eventToShow = null;
    let isLiveEvent = false;
    
    // Check for live events first
    if (liveEventQueue.length > 0) {
      eventToShow = liveEventQueue.shift();
      isLiveEvent = true;
      console.log('[SocialProof] Displaying live event:', eventToShow);
    } else {
      // Use fallback event
      eventToShow = getRandomFallbackEvent();
      if (eventToShow) {
        console.log('[SocialProof] Displaying fallback event:', eventToShow);
      } else {
        console.log('[SocialProof] No events available to display');
        console.log('[SocialProof] Debug info - currentSiteId:', currentSiteId, 'fallbackEvents.length:', fallbackEvents.length);
      }
    }
    
    // Only show toast if we have an event
    if (eventToShow) {
      const message = formatEventMessage(eventToShow);
      showToast(message);
    }
    
    // Schedule next event
    scheduleNextEvent();
  }
  
  function scheduleNextEvent() {
    // Clear existing timer
    if (eventDisplayTimer) {
      clearTimeout(eventDisplayTimer);
    }
    
    let delay;
    
    if (isBurstMode) {
      delay = getBurstDelay() * 1000;
      burstEventCount++;
      
      // Check if burst mode is complete
      if (burstEventCount >= 2) {
        isBurstMode = false;
        burstEventCount = 0;
        console.log('[SocialProof] Burst mode complete, switching to normal mode');
      }
    } else {
      delay = getRandomDelay() * 1000;
    }
    
    console.log(`[SocialProof] Next event in ${delay/1000}s (${isBurstMode ? 'burst' : 'normal'} mode)`);
    
    eventDisplayTimer = setTimeout(() => {
      displayNextEvent();
    }, delay);
  }
  
  function startBurstMode() {
    console.log('[SocialProof] Starting burst mode');
    isBurstMode = true;
    burstEventCount = 0;
    
    // Schedule the next burst
    const nextBurst = CONFIG.BURST_INTERVAL + (Math.random() - 0.5) * CONFIG.BURST_VARIANCE;
    burstModeTimer = setTimeout(() => {
      startBurstMode();
    }, nextBurst);
  }
  
  async function fetchFallbackEvents() {
    if (!supabaseClient || !currentSiteId) {
      console.error('[SocialProof] Cannot fetch events: missing supabase client or site ID');
      console.log('[SocialProof] Debug - supabaseClient:', !!supabaseClient, 'currentSiteId:', currentSiteId);
      return [];
    }
    
    try {
      console.log('[SocialProof] Fetching fallback events for site:', currentSiteId);
      
      const { data, error } = await supabaseClient
        .from('events')
        .select('*')
        .eq('site_id', currentSiteId)
        .limit(CONFIG.FALLBACK_EVENT_COUNT);
      
      if (error) {
        console.error('[SocialProof] Error fetching events:', error);
        return [];
      }
      
      console.log('[SocialProof] Fetched events:', data?.length || 0, 'events:', data);
      return data || [];
    } catch (error) {
      console.error('[SocialProof] Exception fetching events:', error);
      return [];
    }
  }
  
  async function initializeFallbackEvents() {
    console.log('[SocialProof] Initializing fallback events...');
    
    // Try to load from cache first
    const cachedData = loadEventsFromCache();
    
    if (cachedData && cachedData.events.length > 0) {
      fallbackEvents = cachedData.events;
      lastShownEventIndex = cachedData.lastShownIndex;
      console.log('[SocialProof] Using cached events:', fallbackEvents.length);
      return;
    }
    
    // Only fetch if we have a site ID
    if (currentSiteId) {
      console.log('[SocialProof] Fetching fresh events for site:', currentSiteId);
      const events = await fetchFallbackEvents();
      
      if (events.length > 0) {
        fallbackEvents = events;
        saveEventsToCache(events, currentSiteId);
        console.log('[SocialProof] Fetched and cached fresh events:', events.length);
      } else {
        console.warn('[SocialProof] No fallback events available for site');
      }
    } else {
      console.warn('[SocialProof] No site ID available, cannot fetch fallback events');
    }
  }
  
  async function getSiteIdFromApiKey() {
    if (!supabaseClient || !apiKey) {
      console.error('[SocialProof] Cannot lookup site: missing supabase client or API key');
      console.log('[SocialProof] Debug - supabaseClient:', !!supabaseClient, 'apiKey:', apiKey);
      return null;
    }
    
    try {
      const cleanApiKey = getCleanApiKey();
      console.log('[SocialProof] Looking up site for API key:', cleanApiKey);
      
      const { data, error } = await supabaseClient
        .from('sites')
        .select('id, site_url')
        .eq('api_key', cleanApiKey)
        .single();
      
      if (error) {
        console.error('[SocialProof] Error looking up site by API key:', error);
        console.log('[SocialProof] Full error details:', error);
        return null;
      }
      
      console.log('[SocialProof] Found site:', data);
      return data?.id;
    } catch (error) {
      console.error('[SocialProof] Exception looking up site by API key:', error);
      return null;
    }
  }
  
  function handleLiveEvent(payload) {
    console.log('[SocialProof] Received live event:', payload);
    
    // Add to live event queue
    liveEventQueue.push(payload.payload);
    
    // If we're not currently in burst mode and no events are scheduled,
    // show the live event immediately
    if (!eventDisplayTimer && !isBurstMode) {
      displayNextEvent();
    }
  }
  
  function startEventDisplay() {
    console.log('[SocialProof] Starting event display system');
    console.log('[SocialProof] Current state - fallbackEvents:', fallbackEvents.length, 'currentSiteId:', currentSiteId);
    
    // Start with burst mode
    startBurstMode();
    
    // Display first event immediately
    setTimeout(() => {
      displayNextEvent();
    }, 1000);
  }
  
  function cleanup() {
    if (eventDisplayTimer) {
      clearTimeout(eventDisplayTimer);
    }
    if (burstModeTimer) {
      clearTimeout(burstModeTimer);
    }
    
    // Clean up any remaining toasts
    activeToasts.forEach(toast => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    });
    activeToasts = [];
  }
  
  // Initialize everything
  console.log('[SocialProof] Testing toast...');
  showToast('Social proof script loaded successfully!');
  
  const scriptTag = document.createElement('script');
  scriptTag.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  scriptTag.onload = async () => {
    console.log('[SocialProof] Supabase script loaded');
    
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log('[SocialProof] Supabase client created');
      
      // Get site ID from API key
      console.log('[SocialProof] Getting site ID from API key...');
      currentSiteId = await getSiteIdFromApiKey();
      console.log('[SocialProof] Site ID result:', currentSiteId);
      
      if (!currentSiteId) {
        console.error('[SocialProof] Could not determine site ID from API key');
        console.log('[SocialProof] This means either:');
        console.log('1. The API key is incorrect');
        console.log('2. The site doesn\'t exist in the database');
        console.log('3. There\'s a database connection issue');
        return;
      }
      
      // Initialize fallback events
      console.log('[SocialProof] Initializing fallback events...');
      await initializeFallbackEvents();
      console.log('[SocialProof] Fallback events initialized. Count:', fallbackEvents.length);
      
      // Set up broadcast subscription
      console.log('[SocialProof] Setting up broadcast subscription...');
      
      const channel = supabaseClient
        .channel('social-proof-events')
        .on(
          'broadcast',
          { event: 'social-proof-event' },
          handleLiveEvent
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
      
      // Start the event display system
      startEventDisplay();
      
    } catch (error) {
      console.error('[SocialProof] Error initializing:', error);
    }
  };
  
  scriptTag.onerror = () => {
    console.error('[SocialProof] Failed to load Supabase script');
  };
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanup);
  
  document.head.appendChild(scriptTag);
})();