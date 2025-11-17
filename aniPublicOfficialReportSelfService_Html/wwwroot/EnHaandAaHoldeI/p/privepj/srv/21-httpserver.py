
from flask import Flask
import os

app = Flask(__name__)

# Assumes the script is running inside the Python environment in the 'sw' folder
@app.route('/')
def hello_world():
    python_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    return f'Deployment successful! Server running from: {python_path}'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)