from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import os
import uuid
from pydantic import BaseModel
from typing import List, Optional
from measurement import detect_and_measure

app = FastAPI(title="RK FURNISHINGS AI API")

# 💿 PRODUCTION CONFIG
UPLOAD_DIR = "assets/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 🛡️ CORS MIDDLEWARE
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🚀 ENDPOINTS

@app.get("/")
async def root():
    return {"status": "online", "engine": "OpenCV + YOLO Strategy", "version": "2.0.0", "units": "cm"}

@app.post("/measure")
async def measure_room(
    file: UploadFile = File(...), 
    reference_cm: float = Form(8.56) 
):
    image_bytes = await file.read()
    result = detect_and_measure(image_bytes, reference_cm=reference_cm)
    return result

@app.post("/detect-window")
async def detect_window(file: UploadFile = File(...)):
    """
    Simplified detection for the Fabric.js visualizer.
    Returns {x, y, w, h} in pixels.
    """
    image_bytes = await file.read()
    result = detect_and_measure(image_bytes)
    
    if result["status"] == "success" and result["bbox"]:
        x1, y1, x2, y2 = result["bbox"]
        return {
            "status": "success",
            "x": x1,
            "y": y1,
            "w": x2 - x1,
            "h": y2 - y1
        }
    return {"status": "fail", "message": "No window detected"}

@app.post("/recommend")
async def get_recommendation(width_cm: float, height_cm: float):
    """Suggest curtain sizing and count based on dimensions"""
    rec_width = width_cm * 1.2 # 20% stackback
    rec_height = height_cm + 15 # Wall mounting clearance
    
    return {
        "status": "success",
        "recommended_width_cm": round(rec_width, 1),
        "recommended_height_cm": round(rec_height, 1),
        "panel_count": 2 if rec_width > 120 else 1,
        "style_suggestion": "Floor Length" if height_cm > 200 else "Window Sill Length"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("AI_PORT", 10000))
    uvicorn.run(app, host="0.0.0.0", port=port)
