"""
Simple script to run the FastAPI application
"""
import sys
import os

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from app.main import app
    print("=" * 60)
    print("🚀 Starting Diabetic Retinopathy Prediction API")
    print("=" * 60)
    print(f"📁 Working directory: {os.getcwd()}")
    print(f"🔗 API Documentation: http://localhost:8000/docs")
    print(f"🔗 Health Check:       http://localhost:8000/health")
    print("=" * 60)
    
    if __name__ == "__main__":
        import uvicorn
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
        
except ImportError as e:
    print(f"❌ Error importing app: {e}")
    print(f"Python path: {sys.path}")
    print("Make sure you're running from the BACKEND directory")