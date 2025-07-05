'use client';
import { useState } from 'react';

interface RichTextSegment {
  value: string;
  style?: 'bold' | 'italic' | 'underline';
  color?: string;
}

export default function LogEventPage() {
  const [apiKey, setApiKey] = useState('site_9a60c59f-c247-4af4-8048-855be6898e2a');
  const [eventType, setEventType] = useState('user_signup');
  const [name, setName] = useState('John Doe');
  const [city, setCity] = useState('New York');
  const [useRichText, setUseRichText] = useState(true);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const createRichTextMessage = (name: string): RichTextSegment[] => {
    return [
      { value: name, style: 'bold', color: '#e74c3c' },
      { value: ' just signed up from ' },
      { value: city, style: 'bold', color: '#3498db' },
      { value: '!' }
    ];
  };

  const createSimpleMessage = (name: string): string => {
    return `${name || "A user"} has just signed up from ${city}!`;
  };

  const logEvent = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const message = useRichText 
        ? createRichTextMessage(name || "A user")
        : createSimpleMessage(name || "A user");

      const res = await fetch('/api/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          event_type: eventType,
          event_data: { name, city },
          message: message
        })
      });

      const json = await res.json();
      setResult(JSON.stringify(json, null, 2));
      
      if (res.ok) {
        // Clear form on success
        setEventType('');
        setName('');
        setCity('');
      }
    } catch (error) {
      setResult(JSON.stringify({ error: 'Network error: ' + error.message }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Test Event Logging with Rich Text</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">API Key</label>
          <input 
            placeholder="API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Event Type</label>
          <input 
            placeholder="Event Type (e.g., user_signup, page_view)"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input 
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input 
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="useRichText"
            checked={useRichText}
            onChange={(e) => setUseRichText(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="useRichText" className="text-sm font-medium">
            Use Rich Text Message
          </label>
        </div>

        {/* Message Preview */}
        <div className="bg-gray-50 p-3 rounded">
          <h3 className="text-sm font-medium mb-2">Message Preview:</h3>
          {useRichText ? (
            <div className="text-sm">
              <span style={{ fontWeight: 'bold', color: '#e74c3c' }}>
                {name || "A user"}
              </span>
              <span> just signed up from </span>
              <span style={{ fontWeight: 'bold', color: '#3498db' }}>
                {city}
              </span>
              <span>!</span>
            </div>
          ) : (
            <div className="text-sm">
              {createSimpleMessage(name || "A user")}
            </div>
          )}
        </div>
        
        <button
          onClick={logEvent}
          disabled={loading || !apiKey || !eventType}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? 'Logging...' : 'Log Event'}
        </button>
      </div>
      
      {result && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Result:</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}