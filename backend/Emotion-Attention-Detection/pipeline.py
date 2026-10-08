import sys
import whisper
import os
import ssl
import subprocess
import json

# Bypass SSL issues when downloading Whisper models if they arise
ssl._create_default_https_context = ssl._create_unverified_context

# Inject local FFmpeg binary into the Python process PATH
# This ensures that both subprocess.run and the whisper.load_model internals can find `ffmpeg.exe`
os.environ["PATH"] += os.pathsep + r'C:\Users\mnua4\OneDrive\Desktop\antigravity-videoplayer\fyp\ffmpeg_install\ffmpeg-master-latest-win64-gpl\bin'

def transcribe_video(video_url, lecture_id):
    """
    Extracts audio from a video URL and transcribes it using Whisper.
    Prints the resulting text to stdout.
    """
    audio_file = f"temp_audio_{lecture_id}.wav"
    
    try:
        # Step 1: Extract audio using ffmpeg
        # We use a lower bitrate and mono for Whisper efficiency
        # command: ffmpeg -i "URL" -ar 16000 -ac 1 -c:a pcm_s16le OUTPUT.wav
        
        # Using subprocess for better error handling/execution than os.system
        ffmpeg_params = [
            r'C:\Users\mnua4\OneDrive\Desktop\antigravity-videoplayer\fyp\ffmpeg_install\ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe',
            '-i', video_url,
            '-ar', '16000',
            '-ac', '1',
            '-c:a', 'pcm_s16le',
            audio_file,
            '-y', # Overwrite existing
            '-loglevel', 'error'
        ]
        
        print(f"DEBUG: Extracting audio from {video_url}...", file=sys.stderr)
        subprocess.run(ffmpeg_params, check=True)

        if not os.path.exists(audio_file):
            print("Error: Audio extraction failed (file not found)", file=sys.stderr)
            return

        # Step 2: Load Whisper Model (base model is a good balance for FYP speed)
        print("DEBUG: Loading Whisper 'base' model...", file=sys.stderr)
        model = whisper.load_model("base")

        # Step 3: Transcribe
        print("DEBUG: Transcribing...", file=sys.stderr)
        result = model.transcribe(audio_file)
        
        # The result["text"] is what Node.js will capture safely
        # We output it as JSON so any spurious C++ warnings printed by whisper to stdout
        # don't corrupt the actual transcript parsed by Node.js.
        print(json.dumps({"transcript": result["text"]}))

    except subprocess.CalledProcessError as e:
        print(f"Error: FFmpeg failed. Ensure ffmpeg is installed and in your PATH. {str(e)}", file=sys.stderr)
    except Exception as e:
        print(f"Error during transcription pipeline: {str(e)}", file=sys.stderr)
    finally:
        # Step 4: Cleanup
        if os.path.exists(audio_file):
            try:
                os.remove(audio_file)
            except:
                pass

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python pipeline.py <video_url> <lecture_id>", file=sys.stderr)
        sys.exit(1)
        
    transcribe_video(sys.argv[1], sys.argv[2])
