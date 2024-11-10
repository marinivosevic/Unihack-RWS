from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from ultralytics import YOLO
import numpy as np
import base64
from PIL import Image
import io

app = FastAPI()

# Load the model once when the application starts
model = YOLO('best.pt')  # Ensure 'best.pt' is accessible

class ImageRequest(BaseModel):
    image: str
    statement: str

@app.post("/classify/")
async def classify_image(request: ImageRequest):
    try:
        image_base64 = request.image
        statement = request.statement

        # Remove data URL prefix if present
        if image_base64.startswith('data:image'):
            image_base64 = image_base64.split(',', 1)[1]

        # Decode the base64 string
        image_data = base64.b64decode(image_base64)

        # Use PIL to open the image
        image = Image.open(io.BytesIO(image_data)).convert('RGB')

        # Convert PIL Image to OpenCV format
        image = np.array(image)
        image = image[:, :, ::-1].copy()  # Convert RGB to BGR

        # Run the model on the image
        results = model(image)

        # Get the predicted class
        predicted_class_index = int(results[0].probs.top1)
        class_names = model.model.names
        predicted_class = class_names[predicted_class_index]

        prediction = (predicted_class == statement)

        return {
            'message': 'Image classification completed',
            'prediction': prediction,
            'predicted_class': predicted_class
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Error during prediction: {e}')