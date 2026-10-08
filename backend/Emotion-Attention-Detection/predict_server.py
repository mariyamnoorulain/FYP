import json
import base64
import numpy as np
import cv2
import imutils
import os
import sys

# Change working directory so haarcascade and models load correctly
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)

from http.server import BaseHTTPRequestHandler, HTTPServer
import warnings
warnings.filterwarnings('ignore') # Disable keras warnings

# Only import load_model here to prevent TF messages from messing up initialization
from keras.models import load_model
from keras.preprocessing.image import img_to_array

print("Loading ML models for emotion detection... Please wait.")
face_cascade = cv2.CascadeClassifier('haarcascade_files/haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier('haarcascade_files/haarcascade_eye.xml')

video_emotion_model_path = 'models/model_num.hdf5'
emotion_classifier = load_model(video_emotion_model_path, compile=False)
EMOTIONS = ["angry" ,"disgust","fear", "happy", "sad", "surprised", "neutral"]

print("Models loaded successfully.")

class RequestHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        # We don't want to log every single HTTP request to stdout as it may clog Node.js
        pass

    def _set_headers(self, status_code=200):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        # Add CORS headers if necessary, though it will only be called from node backend
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            image_base64 = data.get('image_base64', '')
            
            if image_base64.startswith('data:image/'):
                image_base64 = image_base64.split(',')[1]
                
            img_data = base64.b64decode(image_base64)
            nparr = np.frombuffer(img_data, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if frame is None:
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": "Invalid image"}).encode('utf-8'))
                return
                
            frame = imutils.resize(frame, width=400)
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30,30), flags=cv2.CASCADE_SCALE_IMAGE)
            
            attentive = False
            label = "neutral"
            
            if len(faces) == 0:
                result = {
                    "emotion": "neutral",
                    "attention": False,
                    "faceDetected": False
                }
            else:
                for (x,y,w,h) in faces:
                    roi = gray[y:y+h, x:x+w]
                    
                    # Apply CLAHE to improve feature detection in varying light
                    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
                    roi_clahe = clahe.apply(roi)
                    
                    # Log for debugging
                    print("Face detected, analyzing attention & emotion...")
                    
                    # Detect eyes for attention
                    # minNeighbors=3 is more relaxed than 5 (handles low-res webcams better)
                    # minSize=(10,10) is smaller than (15,15) (handles users further from screen)
                    eyes = eye_cascade.detectMultiScale(roi_clahe, 1.1, 3, 0, (10, 10))
                    if len(eyes) >= 1:
                        attentive = True
                        
                    roi_prep = cv2.resize(roi_clahe, (48, 48))
                    roi_prep = roi_prep.astype("float") / 255.0
                    roi_prep = img_to_array(roi_prep)
                    roi_prep = np.expand_dims(roi_prep, axis=0)
                    
                    preds = emotion_classifier.predict(roi_prep, verbose=0)[0]
                    # EMOTIONS: ["angry" ,"disgust","fear", "happy", "sad", "surprised", "neutral"]
                    # Indices: 0(angry), 2(fear), 4(sad), 6(neutral)
                    
                    max_idx = preds.argmax()
                    max_conf = preds[max_idx]
                    label = EMOTIONS[max_idx]
                    
                    sad_conf = preds[4]
                    neutral_conf = preds[6]
                    
                    # Refinement Logic:
                    # Map 'fear' and 'sad' to 'confused' with a lower threshold (0.25)
                    if EMOTIONS[max_idx] in ["fear", "sad"]:
                        if max_conf >= 0.25:
                            label = "confused"
                        else:
                            label = "neutral"
                    
                    # Keep others if they exceed the general threshold (0.35)
                    elif max_conf < 0.35:
                        label = "neutral"
                    else:
                        label = EMOTIONS[max_idx]
                        
                        # Special filter for angry confusion at lowish confidence
                        if label == "angry" and max_conf < 0.5 and max_conf < (neutral_conf * 1.5):
                            label = "neutral"
                    
                    # 4. Final Mapping: Map 'fear', 'sad', and 'disgust' to 'confused' (Backup check)
                    if label in ["fear", "sad"]:
                        label = "confused"
                    
                    print(f"Results -> Final Label: {label} (Original: {EMOTIONS[max_idx]}, Conf: {max_conf:.2f}), Attentive: {attentive}")
                    
                    # only take the first face detected
                    break
                    
                result = {
                    "emotion": label,
                    "attention": attentive,
                    "faceDetected": True
                }
            
            self._set_headers(200)
            self.wfile.write(json.dumps(result).encode('utf-8'))
            
        except Exception as e:
            import traceback
            traceback.print_exc()
            self._set_headers(500)
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))

def run(server_class=HTTPServer, handler_class=RequestHandler, port=5001):
    server_address = ('127.0.0.1', port)
    httpd = server_class(server_address, handler_class)
    print(f"Prediction server listening on port {port}...")
    sys.stdout.flush()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print("Server stopped.")

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5001
    run(port=port)
