# Stitch: Retirement Transaction Control Hub (Loan Flow)

When you click **Start Loan** on the Transactions page, the app navigates to the loan request flow. The design for this flow is defined in **Stitch** as the screen **"Retirement Transaction Control Hub"**.

## Stitch project and screen

| Field | Value |
|-------|--------|
| **Project ID** | `10256073304949357127` |
| **Screen name** | Retirement Transaction Control Hub |
| **Screen ID** | `765866d442ff47e58cb7e09fcae879ba` |

## Get images and code from Stitch

You need the Stitch MCP CLI and authentication (API key or gcloud). Then you can download the screen's **image** and **HTML/code** and use them to align the app's loan flow UI.

### 1. One-time setup (choose one)

**Option A – API key (simplest)**  
1. Open [Stitch](https://stitch.withgoogle.com/) → profile → **Stitch Settings** → **API Keys** → **Create Key**.  
2. Set it in your environment:
   ```bash
   export STITCH_API_KEY="your-api-key-here"
   ```

**Option B – gcloud / Stitch MCP init**  
```bash
npx @_davideast/stitch-mcp init
```
Follow the prompts (gcloud, project, OAuth).

### 2. Download the screen

From the repo root, with `STITCH_API_KEY` set (or after `stitch-mcp init`).

The fetch script calls **`get_screen`** first and uses **`curl -L`** on `htmlCode.downloadUrl` / `screenshot.downloadUrl` when present; otherwise it uses **`get_screen_code`** / **`get_screen_image`**. Override targets with `STITCH_PROJECT_ID`, `STITCH_SCREEN_ID`, and `STITCH_OUT_DIR` (defaults match this loan-hub screen).

**Option 1 – npm script**
```bash
STITCH_API_KEY=your-key npm run stitch:fetch-loan-hub
```

**Option 2 – Manual CLI** (if the script fails, e.g. JSON format):

```bash
mkdir -p designs/stitch-retirement-control-hub

npx -y @_davideast/stitch-mcp tool get_screen_code -d '{"projectId": "10256073304949357127", "screenId": "765866d442ff47e58cb7e09fcae879ba"}' > designs/stitch-retirement-control-hub/screen.html 2>/dev/null || true

npx -y @_davideast/stitch-mcp tool get_screen_image -d '{"projectId": "10256073304949357127", "screenId": "765866d442ff47e58cb7e09fcae879ba"}' > designs/stitch-retirement-control-hub/screen-image.json 2>/dev/null || true
```

Or use the interactive browser:

```bash
npx -y @_davideast/stitch-mcp view --project 10256073304949357127 --screen 765866d442ff47e58cb7e09fcae879ba
```

### 3. If the API returns hosted URLs

If you get `screenshot.downloadUrl` and `htmlCode.downloadUrl` from the API, download with:

```bash
curl -L -o designs/stitch-retirement-control-hub/screen.png "<screenshot.downloadUrl>"
curl -L -o designs/stitch-retirement-control-hub/screen.html "<htmlCode.downloadUrl>"
```

### 4. Use the assets

- **screen.html**: Reference for layout and copy of the Retirement Transaction Control Hub; align the loan flow UI (eligibility → amount → terms → review) to this.
- **screen.png**: Visual reference for the same flow.

Current app: **Start Loan** → `/transactions/loan/start` → draft → `/transactions/loan/{id}` (Eligibility → Loan Amount → Repayment Terms → Review). Match that flow's UI to this Stitch screen.

## npm script

In `package.json` you can add:

```json
"stitch:fetch-loan-hub": "node scripts/fetch-stitch-screen.js"
```

Then: `STITCH_API_KEY=your-key npm run stitch:fetch-loan-hub`
