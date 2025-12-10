#!/usr/bin/env python3
"""
Build script for creating a standalone executable from main.py using PyInstaller.
"""

import subprocess
import sys
import os

def build_standalone():
    """Build a standalone executable using PyInstaller."""
    
    # Ensure we're in the backend directory
    if not os.path.exists('main.py'):
        print("Error: main.py not found. Make sure you're in the backend directory.")
        sys.exit(1)
    
    # Check if PyInstaller is available
    try:
        import PyInstaller
    except ImportError:
        print("Installing PyInstaller...")
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'pyinstaller'])
    
    # PyInstaller command to build the standalone app
    cmd = [
        'pyinstaller',
        '--onefile',  # Create a single executable file
        '--name=main',  # Name of the output executable
        '--distpath=dist',  # Output directory
        '--workpath=build',  # Temporary build directory
        'main.py'  # Main Python file
    ]
    
    print("Building standalone executable...")
    print(f"Running: {' '.join(cmd)}")
    
    try:
        subprocess.check_call(cmd)
        print("✅ Build successful! Executable created in dist/main")
    except subprocess.CalledProcessError as e:
        print(f"❌ Build failed with error code {e.returncode}")
        sys.exit(1)

if __name__ == "__main__":
    build_standalone()