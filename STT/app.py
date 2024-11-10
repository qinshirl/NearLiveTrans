import whisperx
import gc 
import torch
import subprocess
import flask
import os
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS

device = "cuda" 

app = Flask(__name__)
CORS(app) 
UPLOAD_FOLDER = '/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def upload_form():
    return render_template_string('''
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Audio Transcription</title>
    </head>
    <body>
      <h1>Upload Audio File for Transcription</h1>
      <form id="uploadForm" enctype="multipart/form-data">
        <input type="file" name="file" accept="audio/*" required>
        <button type="submit">Transcribe</button>
      </form>
      <div id="result"></div>

      <script>
        document.getElementById('uploadForm').onsubmit = async function(event) {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', document.querySelector('input[type="file"]').files[0]);

        const resultDiv = document.getElementById('result');

        try {
          // First, send the transcription request
          const response = await fetch('/transcribe', {
            method: 'POST',
            body: formData
          });

          if (!response.ok) {
            const error = await response.json();
            resultDiv.innerHTML = '<h2>Error:</h2><p>' + error.error + '</p>';
            return;
          }

          const result = await response.json();
          resultDiv.innerHTML = '<h2>Transcription Result:</h2><pre>' + JSON.stringify(result, null, 2) + '</pre>';

          // Second, send the translation request
          const response2 = await fetch('http://localhost:5002/translate', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "text": result[0]["text"], "target_lang": "FR" })
          });

          if (!response2.ok) {
            const error2 = await response2.json();
            resultDiv.innerHTML += '<h2>Translation Error:</h2><p>' + error2.error + '</p>';
            return;
          }

          const result2 = await response2.json();
          resultDiv.innerHTML += '<h2>Translation Result:</h2><pre>' + JSON.stringify(result2, null, 2) + '</pre>';

        } catch (error) {
          resultDiv.innerHTML = '<h2>Error:</h2><p>' + error.message + '</p>';
        }
      };
      </script>
    </body>
    </html>
    ''')


@app.route('/transcribe', methods=['POST'])
def transcribe():
  if 'file' not in request.files:
    return jsonify({"error": "No file part"}), 400

  file = request.files['file']
  if file.filename == '':
    return jsonify({"error": "No selected file"}), 400

  # Save the file to the specified upload folder
  file_path = os.path.join(UPLOAD_FOLDER, file.filename)
  print(f"Saving file to: {file_path}")
  file.save(file_path)
  
  # Load the audio for transcription
  audio = whisperx.load_audio(file_path)
  device = "cuda" 
  compute_type = "int8"
  model_dir = "/path/"
  model = whisperx.load_model("large-v2", device, compute_type=compute_type, download_root=model_dir)
  batch_size = 16
  result = model.transcribe(audio, batch_size=batch_size)
  # print(result["segments"]) # before alignment
  # model_a, metadata = whisperx.load_align_model(language_code=result["language"], device=device)
  # result = whisperx.align(result["segments"], model_a, metadata, audio, device, return_char_alignments=False)
  # print(result["segments"]) # after alignment
  # diarize_model = whisperx.DiarizationPipeline(use_auth_token="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", device=device)
  # diarize_segments = diarize_model(audio)
  # result = whisperx.assign_word_speakers(diarize_segments, result)
  # print(result["segments"]) # segments are now assigned speaker IDs

  return jsonify(result["segments"])

if __name__ == '__main__':
  app.run(host="0.0.0.0", port=5001)
  