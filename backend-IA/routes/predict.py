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

def postprocess_mask_and_calculate_percentage(mask_tensor):

    # 1. Criar a máscara binária
    mask_is_forest = (mask_tensor[0, :, :, 0].numpy() > 0.5)

    # 2. Calcular a porcentagem
    forest_pixels = mask_is_forest.sum()
    total_pixels = mask_is_forest.shape[0] * mask_is_forest.shape[1]

    # Evitar divisão por zero se a imagem for inválida
    if total_pixels == 0:
        forest_percentage = 0.0
    else:
        # (pixels de desmatamento / pixels totais) * 100
        forest_percentage = (forest_pixels / total_pixels) * 100
        
    deforestation_percentage = 100.0 - forest_percentage

    # 3. Preparar a máscara para imagem (convertendo 0 e 1 para 0 e 255)
    mask_image_array = (mask_is_forest.astype(np.uint8) * 255)
    mask_image = Image.fromarray(mask_image_array, mode='L')

    # 4. Converter a imagem para Base64
    buffer = io.BytesIO()
    mask_image.save(buffer, format="PNG")
    base64_string = base64.b64encode(buffer.getvalue()).decode('utf-8')

    return {
        'mask_base64': base64_string,
        'deforestation_percentage': deforestation_percentage
    }

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
        
        result = postprocess_mask_and_calculate_percentage(mask_tensor)
        print("mask", result)

        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500