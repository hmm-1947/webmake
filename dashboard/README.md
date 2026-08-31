# Webmake Dashboard

A lightweight local dashboard for editing the generated site's JSON content.

## Run

From the repository root:

```bash
python dashboard/server.py
```

Open `http://localhost:8787`.

## API

- `GET /api/site` — read the editable site JSON
- `POST /api/site` — save the edited site JSON
- `GET /api/media` — list files in `dashboard/media/`

Create `dashboard/media/` and put JPG/PNG/WEBP images or MP4/WEBM/MOV videos there for the media library.

The dashboard intentionally edits the JSON source rather than generated React files. After saving, regenerate the site with the CLI so the renderer produces the updated pages.
