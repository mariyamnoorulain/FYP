@echo off
echo ========================================================
echo Installing Machine Learning Dependencies...
echo ========================================================

python --version
if %errorlevel% neq 0 (
    echo [ERROR] Python is still not installed or not in PATH!
    echo Please reinstall Python and check the "Add Python to PATH" box.
    pause
    exit /b 1
)

echo Python found! Installing requirements...
python -m pip install --upgrade pip
python -m pip install numpy opencv-python tensorflow keras imutils

echo ========================================================
echo COMPLETE! You can now restart your Node backend safely.
echo ========================================================
pause
