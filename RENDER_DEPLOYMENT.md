# Render deployment setup for frontend

This frontend can be deployed as a static site on Render.

## Prerequisites

1. Frontend built with `npm run build` → outputs to `dist/` folder
2. Backend deployed on Render (get the backend URL)

## Deployment Steps

1. **Build the frontend locally**:
   ```bash
   cd frontend/cropadvisor10423-main
   npm install
   npm run build
   ```

2. **Connect to Render**:
   - Go to [render.com](https://render.com)
   - Click "New +"
   - Select "Static Site"
   - Connect your GitHub repository (or upload manually)
   - Set **Publish directory** to `frontend/cropadvisor10423-main/dist`
   - Set build command to `npm install && cd frontend/cropadvisor10423-main && npm run build`

3. **Set Environment Variables in Render**:
   - Under "Environment", add:
     - `VITE_API_URL=https://crop-advisor-backend.onrender.com` (replace with your actual backend URL)

## Alternative: Serve Frontend from Backend

If you prefer a single deployment, build the frontend and serve it from Flask:

```bash
# From root of project
npm run build --prefix frontend/cropadvisor10423-main
# Then add this route to Flask app.py:
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    if path and os.path.exists(f'dist/{path}'):
        return send_from_directory('dist', path)
    return send_from_directory('dist', 'index.html')
```
