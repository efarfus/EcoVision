import io
import base64 
import numpy as np
import tensorflow as tf
from PIL import Image
from flask import Blueprint, request, jsonify

predict_bp = Blueprint('predict', __name__)


model_path = 'artefatos/unet_saved_model'
model = tf.keras.layers.TFSMLayer(model_path, call_endpoint='serving_default')



def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((128, 128))
    img_array = np.array(img).astype(np.float32) 
    return np.expand_dims(img_array, axis=0)

def postprocess_mask_to_base64(mask_tensor):
    mask_array = (mask_tensor[0, :, :, 0].numpy() > 0.5).astype(np.uint8) * 255
    
    mask_image = Image.fromarray(mask_array, mode='L') 

    buffer = io.BytesIO()
    mask_image.save(buffer, format="PNG")
    
    base64_string = base64.b64encode(buffer.getvalue()).decode('utf-8')
    
    return base64_string


@predict_bp.route('/predict', methods=['POST'])
def predict():

    data = request.get_json()
    if not data or 'image_base64' not in data:
        return jsonify({'error': 'JSON inválido ou chave "image_base64" não fornecida'}), 400
    
    try:
        base64_string = data['image_base64']
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
        
        image_bytes = base64.b64decode(base64_string)

        input_img = preprocess_image(image_bytes)
        prediction_output = model(input_img)
        mask_tensor = prediction_output['output_0']
        
        mask_base64 = postprocess_mask_to_base64(mask_tensor)
        print("mask", mask_base64)

        return jsonify({'mask_base64': mask_base64})

    except Exception as e:
        return jsonify({'error': str(e)}), 500