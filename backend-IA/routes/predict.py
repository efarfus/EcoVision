import io
import numpy as np
import tensorflow as tf
from PIL import Image
from flask import Blueprint, request, jsonify
from utils.auth import check_api_key

predict_bp = Blueprint('predict', __name__)

model = tf.keras.models.load_model('artefatos/unet_saved_model')

def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((128, 128))
    img_array = np.array(img) / 255.0
    return np.expand_dims(img_array, axis=0)

def postprocess_mask(mask):
    mask = (mask[0, :, :, 0] > 0.5).astype(np.uint8) * 255
    return mask.tolist()

@predict_bp.route('/predict', methods=['POST'])
def predict():
    if not check_api_key(request):
        return jsonify({'error': 'Acesso não autorizado, chave inválida'}), 401

    if 'image' not in request.files:
        return jsonify({'error': 'Arquivo de imagem não fornecido'}), 400
    
    file = request.files['image']
    image_bytes = file.read()

    try:
        input_img = preprocess_image(image_bytes)
        prediction = model.predict(input_img)
        mask = postprocess_mask(prediction)
        return jsonify({'mask': mask})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
