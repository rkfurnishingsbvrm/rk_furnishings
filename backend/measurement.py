import cv2
import numpy as np
from ultralytics import YOLO
import hashlib
import os
from huggingface_hub import hf_hub_download

# 🔥 PRODUCTION AI ENGINE
MODEL_REPO = "keremberke/yolov8m-window-detection"

class AI_Measurer:
    def __init__(self):
        self._model = None
        self.cache = {}

    @property
    def model(self):
        """Lazy load the model only when needed."""
        if self._model is None:
            self._model = self._load_model()
        return self._model

    def _load_model(self):
        try:
            # Attempt to load specialized window model
            weights_path = hf_hub_download(repo_id=MODEL_REPO, filename="best.pt")
            return YOLO(weights_path)
        except Exception:
            # Fallback to standard YOLOv8n
            return YOLO("yolov8n.pt")

    def get_hash(self, image_bytes):
        return hashlib.md5(image_bytes).hexdigest()

    def find_reference_object(self, img):
        """
        Detects the reference object (e.g., credit card) using aspect ratio filtering.
        Standard ID-1 card is 8.56cm x 5.39cm (Ratio ~1.58)
        """
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        blur = cv2.GaussianBlur(gray, (7, 7), 0)
        edged = cv2.Canny(blur, 50, 150)
        
        edged = cv2.dilate(edged, None, iterations=2)
        edged = cv2.erode(edged, None, iterations=1)

        contours, _ = cv2.findContours(edged.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        best_ref = None
        min_pixels = 500 # Ignore noise
        
        for c in contours:
            area = cv2.contourArea(c)
            if area < min_pixels:
                continue
                
            rect = cv2.minAreaRect(c)
            (x, y), (w, h), angle = rect
            if w == 0 or h == 0: continue
            
            aspect_ratio = max(w, h) / min(w, h)
            # Standard card is 1.58. We allow 1.2 to 2.0 for perspective
            if 1.2 <= aspect_ratio <= 2.2:
                if best_ref is None or area > cv2.contourArea(best_ref):
                    best_ref = c
        
        if best_ref is None:
            # Fallback to largest if no card-like shape found, but with area limit
            valid_contours = [c for c in contours if cv2.contourArea(c) > min_pixels]
            if not valid_contours: return None
            best_ref = max(valid_contours, key=cv2.contourArea)

        rect = cv2.minAreaRect(best_ref)
        (x, y), (w, h), angle = rect
        pixel_dim = max(w, h)
        
        return pixel_dim

    def process_image(self, image_bytes, reference_real_cm=8.56): 
        """
        Main processing pipeline:
        1. Preprocessing (Grayscale, Blur, Edges)
        2. Reference Object Detection (Largest Contour)
        3. Scale Calculation (Pixels per CM)
        4. (Optional) AI Window Detection
        """
        img_hash = self.get_hash(image_bytes)
        
        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        if img is None: return {"status": "fail", "message": "Corrupted Image"}

        h_img, w_img, _ = img.shape
        
        # --- Step 2 & 3: Reference & Scale ---
        ref_pixel_dim = self.find_reference_object(img)
        
        # Fallback if no reference found (use heuristic or previous)
        if ref_pixel_dim and ref_pixel_dim > 0:
            pixels_per_cm = ref_pixel_dim / reference_real_cm
        else:
            # Default scale if no reference detected
            pixels_per_cm = 10.0 # Heuristic default

        # --- Step 4: AI Window Detection (Optional but helpful) ---
        # Using self.model property ensures lazy loading
        results = self.model(img)
        window_box = None
        for r in results:
            for box in r.boxes:
                if float(box.conf[0]) > 0.4:
                    window_box = list(map(int, box.xyxy[0]))
                    break
            if window_box: break

        real_width = 0
        real_height = 0
        if window_box:
            x1, y1, x2, y2 = window_box
            pixel_w = x2 - x1
            pixel_h = y2 - y1
            real_width = pixel_w / pixels_per_cm
            real_height = pixel_h / pixels_per_cm

        result = {
            "status": "success",
            "scale_info": {
                "pixels_per_cm": round(pixels_per_cm, 4),
                "reference_detected": ref_pixel_dim is not None
            },
            "dimensions": {
                "width_cm": round(real_width, 1),
                "height_cm": round(real_height, 1),
            },
            "bbox": window_box,
            "img_size": [w_img, h_img],
            "recommendation": self.get_curtain_suggestion(real_width, real_height) if real_width > 0 else None
        }

        return result

    def get_curtain_suggestion(self, width_cm, height_cm):
        if width_cm == 0: return None
        # Professional logic: 20% wider for stackback, +15cm height for mounting
        recommended_width = width_cm * 1.2
        recommended_height = height_cm + 15 
        
        return {
            "recommended_width_cm": round(recommended_width, 1),
            "recommended_height_cm": round(recommended_height, 1),
            "panels": 2 if recommended_width > 120 else 1,
            "type": "Blackout" if height_cm > 180 else "Sheer"
        }

measurer = AI_Measurer()

def detect_and_measure(image_bytes, reference_cm=8.56):
    return measurer.process_image(image_bytes, reference_cm)
