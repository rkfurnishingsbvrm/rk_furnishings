# 📘 **Project Title**

## **AI-Based Real-Time Interactive 2D Measurement Tool for Interior Design Applications**

---

# 🧾 **1. Abstract**

This project presents a real-time interactive system that measures the dimensions of objects using a camera. Unlike traditional methods, the system allows users to **drag and mark points directly on the live camera feed** to measure distances accurately.

The system uses a **reference object of known dimensions** to compute a pixel-to-real-world scaling factor. It integrates computer vision techniques such as edge detection, contour detection, and geometric calculations to provide real-time measurements.

Additionally, the system supports advanced features like:

* Drag-based measurement
* Live measurement display
* Multiple measurements
* Undo functionality
* Auto-scale detection

This tool is highly useful in **interior design applications**, such as measuring window sizes for curtain placement and estimating furniture dimensions.

---

# 🎯 **2. Objectives**

* Develop a real-time measurement system using a camera
* Enable **interactive drag-based measurement**
* Convert pixel distances into real-world units (cm)
* Support multiple measurements with undo functionality
* Automatically detect reference object for scaling
* Apply system in interior design (curtains, furniture)

---

# ❗ **3. Problem Statement**

Manual measurement using physical tools is inconvenient in many real-world scenarios like:

* Interior design planning
* Online furniture fitting
* Remote measurements

Existing solutions:

* Require expensive sensors (LiDAR, depth cameras)
* Lack user interaction
* Provide inaccurate results without calibration

This project solves these issues using:
👉 **Computer vision + user interaction + reference-based scaling**

---

# 💡 **4. Proposed Solution**

The system introduces an **interactive measurement approach**:

### ✔ Key Features:

* User drags mouse to define measurement line
* System calculates distance in real-time
* Reference object provides accurate scaling
* Measurements are stored and editable

---

# 🧠 **5. System Architecture**

```text
Camera Input
   ↓
Frame Capture
   ↓
Preprocessing (Grayscale, Blur, Edges)
   ↓
Reference Object Detection
   ↓
Scale Calculation
   ↓
User Interaction (Drag Measurement)
   ↓
Distance Calculation
   ↓
Visualization & Output
```

---

# ⚙️ **6. Methodology**

---

## 🔹 Step 1: Image Acquisition

* Capture live frames using webcam

---

## 🔹 Step 2: Preprocessing

* Convert to grayscale
* Apply Gaussian blur
* Perform Canny edge detection

---

## 🔹 Step 3: Reference Object Detection

* Detect largest contour (assumed reference)
* Compute bounding box

---

## 🔹 Step 4: Scale Calculation

Let:

* Reference width (real) = ( R_r )
* Reference width (pixels) = ( P_r )

Scale\ Factor = \frac{R_r}{P_r}

---

## 🔹 Step 5: User Interaction (Drag-Based Measurement)

* Mouse press → start point
* Mouse drag → dynamic endpoint
* Mouse release → save measurement

---

## 🔹 Step 6: Distance Calculation

Distance = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}

---

## 🔹 Step 7: Convert to Real Distance

Real\ Distance = Pixel\ Distance \times Scale

---

## 🔹 Step 8: Visualization

* Draw measurement line
* Display distance in cm
* Store multiple measurements

---

## 🔹 Step 9: Undo Operation

* Remove last measurement using keyboard input

---

# 🛠️ **7. Tools & Technologies**

### 👨💻 Programming Language

* Python

### 📚 Libraries

* OpenCV
* NumPy
* Math

### 🌐 Optional Extensions

* FastAPI (backend)
* React (frontend)

---

# 🔍 **8. Algorithms Used**

### 1. Canny Edge Detection

* Detect object boundaries

### 2. Contour Detection

* Identify shapes

### 3. Bounding Box Algorithm

* Extract object dimensions

### 4. Euclidean Distance Formula

* Compute distance between two points

---

# ⚠️ **9. Challenges and Solutions**

| Challenge              | Description                           | Solution                   |
| ---------------------- | ------------------------------------- | -------------------------- |
| Scale inconsistency    | Distance changes with camera movement | Use reference object       |
| Perspective distortion | Tilted view affects accuracy          | Keep objects in same plane |
| Noise in detection     | Irregular edges                       | Apply blur + threshold     |
| User error             | Wrong point selection                 | Provide drag visualization |

---

# ✅ **10. Advantages**

* Real-time measurement
* Interactive and user-friendly
* Low cost (no special hardware)
* High flexibility
* Supports multiple measurements

---

# ❌ **11. Limitations**

* Requires reference object
* Accuracy depends on camera angle
* Not suitable for 3D measurements
* Errors if objects are in different planes

---

# 🏠 **12. Applications (Interior Design Focus)**

### 🪟 Curtain Measurement

* Measure window width & height
* Suggest curtain dimensions

### 🛋️ Furniture Placement

* Measure available space
* Fit furniture accordingly

### 🧱 Wall Measurement

* Estimate wall dimensions for decor

---

# 🧪 **13. Testing & Validation**

### Test Scenarios:

* Different lighting conditions
* Different object sizes
* Different camera distances

### Evaluation Metrics:

* Accuracy (±1–2 cm)
* Response time
* Stability of measurements

---

# 📊 **14. Expected Results**

* Real-time measurement display
* Smooth drag interaction
* Multiple measurements supported
* Stable and consistent outputs

---

# 🔮 **15. Future Enhancements**

* AR-based measurement (mobile apps)
* Depth estimation using AI
* Automatic object detection (YOLO)
* Curtain visualization (“View in your room”)
* Voice-controlled measurement

---

# 📚 **16. Conclusion**

The project successfully demonstrates a real-time interactive measurement system using computer vision. By combining reference-based scaling with user interaction, the system provides accurate and flexible measurements.

It serves as a powerful tool for **interior design applications**, enabling users to measure spaces and plan designs efficiently without physical tools.
