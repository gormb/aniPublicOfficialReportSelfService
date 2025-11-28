import http.server
import socketserver
import webbrowser
import os
import sys
import time
import threading

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def open_browser():
    # Wait a moment for the server to start
    time.sleep(1)
    url = f"http://localhost:{PORT}/db_supabase_create.html"
    print(f"Opening browser at {url}")
    webbrowser.open(url)

def serve():
    # Allow reuse of address to avoid "Address already in use" errors
    socketserver.TCPServer.allow_reuse_address = True
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving HTTP on 0.0.0.0 port {PORT} (http://localhost:{PORT}) ...")
        
        # Open browser in a separate thread
        threading.Thread(target=open_browser).start()
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nKeyboard interrupt received, exiting.")
            httpd.server_close()

if __name__ == "__main__":
    serve()
