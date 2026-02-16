#!/bin/bash

# Start script for Atomic Broker Client SDK
# This script demonstrates the usage of the broker client SDK

echo "🚀 Starting Atomic Broker Client SDK Demo"
echo ""

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed or not in PATH"
    exit 1
fi

# Check if required packages are installed
if ! python3 -c "import requests" &> /dev/null; then
    echo "❌ Required package 'requests' is not installed"
    echo "Please install it using: pip install requests"
    exit 1
fi

echo "✅ Environment check passed"
echo ""

echo "📊 Running broker client demo..."
echo ""

# Run the broker client SDK with example usage
python3 atomic_broker_sdk.py

echo ""
echo "🎉 Broker client demo completed!"
echo ""
echo "💡 To use the broker client in your own projects:"
echo "   • Import atomic_broker_sdk: from atomic_broker_sdk import BrokerGatewayClient"
echo "   • Create client: client = BrokerGatewayClient()"
echo "   • Invoke operations: response = client.invoke_operation('operation_name', params)"
echo ""