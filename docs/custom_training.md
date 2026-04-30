# 🎨 Custom Window Training Walkthrough

To move from "generic AI" to "production-grade accuracy," you need to fine-tune your model on local architectural styles (Bhimavaram windows might look different than US suburban windows!).

## 1. Data Collection (Bhimavaram Specific)
Collect 100-200 images of windows from your actual showroom or local client homes.
- **Tip:** Capture images in different lighting and angles.

## 2. Labeling with Roboflow
1.  Go to [Roboflow Universe](https://universe.roboflow.com).
2.  Create a new project: `window_detection_rk`.
3.  Upload your images.
4.  Draw bounding boxes around each window (label as `window`).
5.  Generate a version and Export as **YOLOv8** format.

## 3. Fine-Tuning Script
Run this script on a machine with a GPU (Google Colab is perfect):

```python
from ultralytics import YOLO

# 1. Load the architecture-tuned base model
model = YOLO('keremberke/yolov8m-window-detection')

# 2. Train on your local dataset for 50 epochs
model.train(
    data='path/to/your/data.yaml', 
    epochs=50, 
    imgsz=640, 
    device=0  # Use 0 for GPU
)

# 3. Export weights
model.export(format='onnx')
```

## 4. Deploy to RK PROJECT
1.  Find your `best.pt` in `runs/detect/train/weights/`.
2.  Move it to `backend/models/window_rk_final.pt`.
3.  Update `measurement.py`:
    ```python
    model = YOLO("models/window_rk_final.pt")
    ```

## 5. Why do this?
- **Precision:** Generic models often miss "Sliding Windows" or "French Windows."
- **Confidence:** Higher accuracy means fewer manual corrections.
- **Brand Authority:** Shows you have a proprietary AI engine.
