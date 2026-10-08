from keras.preprocessing.image import img_to_array
import cv2
import imutils
from keras.models import load_model
import numpy as np

# --- Initialization ---
face_cascade = cv2.CascadeClassifier('haarcascade_files/haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier('haarcascade_files/haarcascade_eye.xml')

video_file_name = "sample/live_vid2.mp4" # Removed for clarity but kept in case needed
video_emotion_model_path = 'models/model_num.hdf5'

# KEY CHANGE: Set to True for real-time webcam feed
use_live_video=True 

emotion_classifier = load_model(video_emotion_model_path, compile=False)
EMOTIONS = ["angry" ,"disgust","fear", "happy", "sad", "surprised", "neutral"]

cv2.namedWindow('Emotion Attention Detector')
emotions_map = {
    "angry" : 0, "disgust" : 0, "fear" : 0, "happy" : 0,
    "sad" : 0, "surprised" : 0, "neutral" : 0
}

count = 0

if use_live_video==True:
    cap = cv2.VideoCapture(0) # Captures from default webcam
else:       
    cap = cv2.VideoCapture(video_file_name)
  
# total_frames and frame_count are vestigial for live video but kept for compatibility
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
frame_count = 0
current_second = 0

# Define new font parameters for better visibility
FONT = cv2.FONT_HERSHEY_SIMPLEX
ATTENTION_FONT_SCALE = 0.65 # Increased from 0.45
PROBABILITY_FONT_SCALE = 0.60 # Increased from 0.45
FONT_THICKNESS = 2 # Keeping the thickness at 2

# --- Main Loop ---
while 1:
    try:
        if cap!=None:
            ret, frame = cap.read()
            if not ret:
                break
                
            frame = imutils.resize(frame,width=400)
        
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray,scaleFactor=1.1,minNeighbors=5,minSize=(30,30),flags=cv2.CASCADE_SCALE_IMAGE)
        
            canvas = np.zeros((350, 400, 3), dtype="uint8")
            
            if (len(faces)==0):
                attentive=False
                # INCREASED FONT SIZE for "Not-Attentive (student unavailable)"
                cv2.putText(frame, "Not-Attentive (student unavailable)", (10, 30),
                            FONT, ATTENTION_FONT_SCALE, (0, 0, 255), FONT_THICKNESS)
                    
            for (x,y,w,h) in faces:
                cv2.rectangle(frame,(x,y),(x+w,y+h),(255,0,0),2)
                roi = gray[y:y+h, x:x+w]
                roi_color = frame[y:y+h, x:x+w]
                
                eyes = eye_cascade.detectMultiScale(roi)
                for (ex,ey,ew,eh) in eyes[:2]:
                    cv2.rectangle(roi_color,(ex,ey),(ex+ew,ey+eh),(0,255,0),2)
                    
                roi = cv2.resize(roi, (48, 48))
                roi = roi.astype("float") / 255.0
                roi = img_to_array(roi)
                roi = np.expand_dims(roi, axis=0)
                
                
                preds = emotion_classifier.predict(roi, verbose=0)[0]
                emotion_probability = np.max(preds)
                label = EMOTIONS[preds.argmax()]
                emotions_map[label]+=1
            
                # Color for the probability bar text (white)
                TEXT_COLOR = (255, 255, 255)
                # Color for the probability bar (B, G, R)
                BAR_COLOR = (0, 0, 255) # Red for high contrast
                
                for (i, (emotion, prob)) in enumerate(zip(EMOTIONS, preds)):
                    text = "{}: {:.2f}%".format(emotion, prob * 100) # Removed 'current_second' text for clarity
                    w_bar = int(prob * 350) # Increased bar length
                    
                    # Draw the bar with the new BAR_COLOR
                    cv2.rectangle(canvas, (7, (i * 45) + 5),
                                  (w_bar, (i * 45) + 40), BAR_COLOR, -1)
                                  
                    # INCREASED FONT SIZE for Probability text
                    cv2.putText(canvas, text, (10, (i * 45) + 30),
                                FONT, PROBABILITY_FONT_SCALE, TEXT_COLOR, FONT_THICKNESS)
                    
                    attentive = False;
                    if (len (eyes)>=1):
                        attentive = True;
                    
                    if (attentive):
                        label_text = "Attentive ("+label+")"
                        LABEL_COLOR = (0, 255, 0) # Green for Attentive
                    else:
                        label_text = "Not-Attentive ("+label+")"
                        LABEL_COLOR = (0, 0, 255) # Red for Not-Attentive
                        
                    # INCREASED FONT SIZE for Label above the face
                    cv2.putText(frame, label_text, (x, y - 15),
                                FONT, ATTENTION_FONT_SCALE, LABEL_COLOR, FONT_THICKNESS)
    
            cv2.imshow('Student Attention Detector',frame)
            cv2.imshow('Face Emotion Probabilities using AI', canvas)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
    except:
        break
        print ("Exiting")

# --- Cleanup ---
cap.release()
cv2.destroyAllWindows()