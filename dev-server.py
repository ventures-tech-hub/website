"""Local preview server with a deliberately small design-settings save API.

Run: python dev-server.py
Then open: http://localhost:5500/local-editor.html
"""

from __future__ import annotations

import json
import re
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parent
OVERRIDES = ROOT / "css" / "local-design-overrides.css"
DEFAULTS = {
    "heroImageScale": 1.1,
    "iconSize": 40,
    "cardPadding": 32,
}


def current_settings() -> dict[str, float | int]:
    if not OVERRIDES.exists():
        return DEFAULTS.copy()
    css = OVERRIDES.read_text(encoding="utf-8")
    patterns = {
        "heroImageScale": r"--fb-hero-image-scale:\s*([0-9.]+)",
        "iconSize": r"--fb-key-icon-size:\s*([0-9.]+)px",
        "cardPadding": r"--fb-key-padding-y:\s*([0-9.]+)px",
    }
    values = {}
    for key, pattern in patterns.items():
        match = re.search(pattern, css)
        values[key] = float(match.group(1)) if match else DEFAULTS[key]
    return {
        "heroImageScale": round(clamp_number(values["heroImageScale"], 0.9, 1.3, DEFAULTS["heroImageScale"]), 2),
        "iconSize": round(clamp_number(values["iconSize"], 32, 56, DEFAULTS["iconSize"])),
        "cardPadding": round(clamp_number(values["cardPadding"], 20, 48, DEFAULTS["cardPadding"])),
    }


def clamp_number(value: object, minimum: float, maximum: float, fallback: float) -> float:
    try:
        return max(minimum, min(maximum, float(value)))
    except (TypeError, ValueError):
        return fallback


def save_settings(payload: object) -> dict[str, float | int]:
    data = payload if isinstance(payload, dict) else {}
    settings = {
        "heroImageScale": round(clamp_number(data.get("heroImageScale"), 0.9, 1.3, DEFAULTS["heroImageScale"]), 2),
        "iconSize": round(clamp_number(data.get("iconSize"), 32, 56, DEFAULTS["iconSize"])),
        "cardPadding": round(clamp_number(data.get("cardPadding"), 20, 48, DEFAULTS["cardPadding"])),
    }
    OVERRIDES.write_text(
        "/* Saved automatically by local-editor.html. Keep this file committed with visual adjustments. */\n"
        ":root {\n"
        f"  --fb-hero-image-scale: {settings['heroImageScale']};\n"
        f"  --fb-key-icon-size: {settings['iconSize']}px;\n"
        f"  --fb-key-padding-y: {settings['cardPadding']}px;\n"
        "}\n",
        encoding="utf-8",
    )
    return settings


class LocalHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self) -> None:
        if self.path.split("?", 1)[0] == "/api/design-settings":
            self._json(HTTPStatus.OK, current_settings())
            return
        super().do_GET()

    def do_POST(self) -> None:
        if self.path.split("?", 1)[0] != "/api/design-settings":
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        try:
            size = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(size).decode("utf-8"))
            self._json(HTTPStatus.OK, save_settings(payload))
        except (ValueError, json.JSONDecodeError):
            self._json(HTTPStatus.BAD_REQUEST, {"error": "Expected JSON settings."})

    def _json(self, status: HTTPStatus, payload: object) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    print("Design editor: http://localhost:5500/local-editor.html")
    ThreadingHTTPServer(("", 5500), LocalHandler).serve_forever()
