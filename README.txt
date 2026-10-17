XX8 Transfer - video background, local QA control

Run:
  python3 -m http.server 8080

Open:
  http://127.0.0.1:8080

Local-only ball control:
  - White ball with 6 stars = failure
  - White ball with 5 stars = success
  - Click the ball to toggle 6 / 5 stars
  - The ball is positioned over the source-video corner symbol

The local ball is a QA/demo control. For a public deployment, transaction results should come from the backend/API.
