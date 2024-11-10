from flask import Flask, request, jsonify
from deepl_translate import deepl_translate_text
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/translate', methods=['POST'])
def translate():
    data = request.json
    text = data.get('text', '')
    target_lang = data.get('target_lang', 'FR')
    translated_text = deepl_translate_text(text, target_language=target_lang)
    return jsonify({'translated_text': translated_text})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
