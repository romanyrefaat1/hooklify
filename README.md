# Hooklify

Hooklify is a powerful event logging and notification platform designed to help SaaS products, web apps, and internal tools capture, store, and visualize user or system events in real time. With a simple API and rich event data support, Hooklify enables teams to build custom dashboards, trigger workflows, or simply keep track of what matters most in their applications.

---

## What is Hooklify?

Hooklify lets you:
- Log any event from your app or service via a simple HTTP API.
- Store rich, structured event data including user actions, system notifications, and more.
- Attach rich-text messages to events for beautiful, context-aware notifications.
- Organize events by site, user, and widget for multi-tenant or multi-product environments.

---

## The Public Log API

Hooklify exposes a public API endpoint for logging events:

**POST** `/api/log`

### Headers

- `x-api-key` (required): Your site’s API key (obtainable from your Hooklify dashboard).

### Body Parameters

Send a JSON object with the following fields:

| Field        | Type                        | Required | Description                                                                 |
|--------------|-----------------------------|----------|-----------------------------------------------------------------------------|
| event_type   | string                      | Yes      | The type of event (e.g., `user_signup`, `error`, `purchase`).               |
| event_data   | object (JSON)               | Yes      | Structured data describing the event. See below for format.                 |
| message      | string or RichTextSegment[] | No       | Optional message to display/notify about this event (see below).            |

#### Example Request

```json
POST /api/log
Headers:
  x-api-key: your_site_api_key

Body:
{
  "event_type": "user_signup",
  "event_data": {
    "city": "New York",
    "name": "John Doe",
    "message": [
      { "color": "#e74c3c", "style": "bold", "value": "John Doe" },
      { "value": " just signed up from " },
      { "color": "#3498db", "style": "bold", "value": "New York" },
      { "value": "!" }
    ]
  },
  "message": [
    { "color": "#e74c3c", "style": "bold", "value": "John Doe" },
    { "value": " just signed up from " },
    { "color": "#3498db", "style": "bold", "value": "New York" },
    { "value": "!" }
  ]
}
```

#### `message` and Rich Text

- The `message` field can be a simple string or an array of rich text segments.
- Each segment can have:
  - `value`: The text to display (required)
  - `style`: One of `bold`, `italic`, `underline` (optional)
  - `color`: Any CSS color string (optional)
- This allows you to create beautiful, dynamic notifications or logs.

**Example of a simple string message:**
```json
"message": "John Doe just signed up from New York!"
```

**Example of a rich text message:**
```json
"message": [
  { "color": "#e74c3c", "style": "bold", "value": "John Doe" },
  { "value": " just signed up from " },
  { "color": "#3498db", "style": "bold", "value": "New York" },
  { "value": "!" }
]
```

---

## Database Schema (Simplified)

Hooklify uses a robust PostgreSQL schema to store your data:

### `events` Table

| Column      | Type      | Description                                               |
|-------------|-----------|-----------------------------------------------------------|
| id          | uuid      | Primary key, unique event ID                              |
| site_id     | uuid      | References the site this event belongs to                 |
| event_type  | text      | Type of event (e.g., signup, error)                       |
| event_data  | jsonb     | Structured event data (see above)                         |
| timestamp   | timestamp | When the event occurred                                   |
| message     | text      | Optional message (can be stringified rich text)           |

- Indexed for fast search by message, site, and timestamp.

### `sites` Table

| Column   | Type   | Description                             |
|----------|--------|-----------------------------------------|
| id       | uuid   | Primary key                             |
| user_id  | uuid   | References the user who owns the site   |
| site_url | text   | The URL of the site                     |
| api_key  | uuid   | API key for authenticating requests     |
| name     | text   | Friendly name for the site              |

### `widgets` Table

| Column      | Type      | Description                                 |
|-------------|-----------|---------------------------------------------|
| id          | uuid      | Primary key                                 |
| type        | text      | Widget type                                 |
| site_url    | text      | URL of the site this widget is for          |
| site_id     | uuid      | References the site                         |
| created_at  | timestamp | Widget creation time                        |
| name        | text      | Widget name                                 |
| description | text      | Widget description                          |
| style       | jsonb     | Widget style options                        |
| api_key     | uuid      | Widget-specific API key (optional)          |

---

## Why Hooklify?

- **Easy Integration:** Just one HTTP request to log any event.
- **Rich Data:** Attach structured and styled messages for advanced notifications.
- **Multi-Tenant:** Organize by site, user, and widget.
- **Secure:** API key authentication for all endpoints.
- **Scalable:** Built on PostgreSQL with efficient indexing.

---

## Get Started

1. Sign up and create a site in your Hooklify dashboard.
2. Copy your site’s API key.
3. Start sending events using the `/api/log` endpoint as shown above.

---

## Embedding the Toast Widget

You can easily embed Hooklify’s Toast widget on your site to display real-time notifications. Simply include the following script tag in your HTML, replacing the API keys with your own:

```html
<script src="https://hooklify.vercel.app/embeds/toast.js"
        site-api-key="your_site_api_key"
        widget-api-key="your_widget_api_key">
</script>
```

- `site-api-key`: Your site’s API key from the Hooklify dashboard.
- `widget-api-key`: The widget’s API key (if applicable).

Place this script before the closing `</body>` tag of your site. The widget will automatically connect to Hooklify and display toast notifications for relevant events.

---

## Support

For questions, support, or feature requests, contact the Hooklify team or visit our documentation portal.
