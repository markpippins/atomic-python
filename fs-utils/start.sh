#!/bin/bash

# Start script for FS Utils
# This script sets up the environment for FS Utils and provides development tools

echo "🚀 Setting up FS Utils Environment"
echo ""

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed or not in PATH"
    exit 1
fi

# Check if required packages are installed
if [ -f "requirements.txt" ]; then
    required_packages=("fastapi" "uvicorn" "pydantic" "requests")
    missing_packages=()

    for package in "${required_packages[@]}"; do
        if ! python3 -c "import $package" &> /dev/null; then
            missing_packages+=("$package")
        fi
    done

    if [ ${#missing_packages[@]} -ne 0 ]; then
        echo "❌ Required packages not installed: ${missing_packages[*]}"
        echo "Please install them using: pip install -r requirements.txt"
        exit 1
    fi
else
    echo "⚠️  No requirements.txt found in fs-utils directory"
fi

echo "✅ Environment check passed"
echo ""

echo "💡 FS Utils is a utility library that provides file system utilities."
echo "   Currently, this project only contains requirements.txt."
echo "   You can install the dependencies and use them in other projects."
echo ""

echo "📦 Installing dependencies if not already installed..."
pip install -r requirements.txt

echo ""
echo "🎉 FS Utils environment ready!"
echo ""
echo "💡 To use these utilities in your projects:"
echo "   • Install the dependencies: pip install -r requirements.txt"
echo "   • Import and use FastAPI, Pydantic, and other utilities as needed"
echo ""