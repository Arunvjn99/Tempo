# Stitch: Retirement Participant Dashboard — Smart Header

Post-enrollment dashboard reference screen from **Google Stitch**.

## Project and screen

| Field | Value |
|-------|--------|
| **Project ID** | `5301772987303506218` |
| **Screen name** | Retirement Participant Dashboard - Smart Header |
| **Screen ID** | `1d3f7a3db2ba4c2ab478f983230ff54e` |

## Download image + code

1. **API key** — [Stitch](https://stitch.withgoogle.com/) → profile → **Stitch Settings** → **API Keys** → create key, then:
   ```bash
   export STITCH_API_KEY="your-api-key-here"
   ```
   Or run `npx @_davideast/stitch-mcp init` (gcloud/OAuth).

2. **From repo root:**
   ```bash
   npm run stitch:fetch-dashboard-smart-header
   ```

   Outputs under `designs/stitch-retirement-dashboard-smart-header/`:

   - `screen.png` — screenshot  
   - `screen.html` — HTML/CSS reference  
   - `get-screen.raw.json` — raw `get_screen` response (includes hosted URLs when the call succeeds)

3. **Manual `curl`** (if you already have `screenshot.downloadUrl` and `htmlCode.downloadUrl` from the API):

   ```bash
   mkdir -p designs/stitch-retirement-dashboard-smart-header
   curl -L -o designs/stitch-retirement-dashboard-smart-header/screen.png "<screenshot.downloadUrl>"
   curl -L -o designs/stitch-retirement-dashboard-smart-header/screen.html "<htmlCode.downloadUrl>"
   ```

4. **CLI only** (same IDs):

   ```bash
   npx -y @_davideast/stitch-mcp tool get_screen -d '{"name":"projects/5301772987303506218/screens/1d3f7a3db2ba4c2ab478f983230ff54e","projectId":"5301772987303506218","screenId":"1d3f7a3db2ba4c2ab478f983230ff54e"}' -o json
   ```

## Product note

This screen is the **post-enrollment command center** (understand / act / learn / monitor), not a generic data dashboard. Implementation in the app should follow the modular layout in the product spec (Smart Header first, then Next Best Actions, Readiness, Learning, Portfolio, Activity, Advisor).
