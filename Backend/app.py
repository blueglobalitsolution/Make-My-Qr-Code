from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
import io
import qrcode
import sqlite3
import re
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import SquareModuleDrawer, CircleModuleDrawer
from qrcode.image.styles.colormasks import SolidFillColorMask
import os

app = Flask(__name__, static_folder=".", static_url_path="")
CORS(app)

DATABASE = "users.db"


def init_db():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            number TEXT NOT NULL,
            email TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()


init_db()


def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()

    name = data.get("name", "").strip()
    number = data.get("number", "").strip()
    email = data.get("email", "").strip()

    if not name or not number or not email:
        return jsonify({"error": "All fields are required"}), 400

    # Validate phone number - only numbers and + allowed
    if not re.match(r"^[+]?[0-9]+$", number):
        return jsonify(
            {
                "error": "Phone number must contain only numbers and optional country code (+)"
            }
        ), 400

    # Validate email format
    if not re.match(r"^[^@]+@[^@]+\.[^@]+$", email):
        return jsonify({"error": "Invalid email format"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO users (name, number, email) VALUES (?, ?, ?)",
        (name, number, email),
    )
    conn.commit()
    user_id = cursor.lastrowid

    cursor.execute("SELECT created_at FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    created_at = row["created_at"] if row else None
    conn.close()

    return jsonify(
        {
            "success": True,
            "message": "Registration successful",
            "user_id": user_id,
            "created_at": created_at,
        }
    ), 201


@app.route("/api/generate-qr", methods=["POST"])
def generate_qr():
    data = request.get_json()

    url = data.get("url", "")
    fg_color = data.get("fgColor", "#000000")
    bg_color = data.get("bgColor", "#ffffff")
    size = data.get("size", 1024)
    level = data.get("level", "H")
    include_margin = data.get("includeMargin", True)
    style = data.get("style", "squares")
    format_type = data.get("format", "png")

    if not url:
        return jsonify({"error": "URL is required"}), 400

    error_correction = {
        "L": qrcode.constants.ERROR_CORRECT_L,
        "M": qrcode.constants.ERROR_CORRECT_M,
        "Q": qrcode.constants.ERROR_CORRECT_Q,
        "H": qrcode.constants.ERROR_CORRECT_H,
    }.get(level, qrcode.constants.ERROR_CORRECT_H)

    qr = qrcode.QRCode(
        version=1,
        error_correction=error_correction,
        box_size=10,
        border=4 if include_margin else 0,
    )
    qr.add_data(url)
    qr.make(fit=True)

    fg_rgb = tuple(int(fg_color.lstrip("#")[i : i + 2], 16) for i in (0, 2, 4))
    bg_rgb = tuple(int(bg_color.lstrip("#")[i : i + 2], 16) for i in (0, 2, 4))

    drawer = SquareModuleDrawer()
    if style == "dots":
        drawer = CircleModuleDrawer()

    img = qr.make_image(
        image_factory=StyledPilImage,
        module_drawer=drawer,
        color_mask=SolidFillColorMask(front_color=fg_rgb, back_color=bg_rgb),
    )

    img = img.resize((size, size))

    buffer = io.BytesIO()
    if format_type == "svg":
        img.save(buffer, format="PNG")
    else:
        img.save(buffer, format="PNG")

    buffer.seek(0)

    return send_file(
        buffer,
        mimetype="image/png",
        as_attachment=False,
        download_name=f"qrcode.{format_type}",
    )


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/")
def serve_frontend():
    return send_from_directory(app.static_folder, "index.html")


@app.route("/<path:path>")
def serve_static(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=2040)
