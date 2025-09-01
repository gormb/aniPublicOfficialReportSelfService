import SwiftUI
import WebKit
import Network

class NetworkMonitor: ObservableObject {
    @Published var isConnected: Bool = true
    private let monitor = NWPathMonitor()
    private let queue = DispatchQueue(label: "NetworkMonitor")

    init() {
        monitor.pathUpdateHandler = { [weak self] path in
            DispatchQueue.main.async {
                self?.isConnected = (path.status == .satisfied)
            }
        }
        monitor.start(queue: queue)
    }
}

struct WebView: UIViewRepresentable {
    let urlOnline: String
    let urlOffline: String
    @ObservedObject var networkMonitor: NetworkMonitor
    
    // The WKWebView instance is only created once
    func makeUIView(context: Context) -> WKWebView {
        return WKWebView()
    }

    // This method is called whenever the state changes
    func updateUIView(_ uiView: WKWebView, context: Context) {
        if networkMonitor.isConnected {
            if let url = URL(string: urlOnline) {
                uiView.load(URLRequest(url: url))
            }
        } else {
            if let filePath = Bundle.main.path(forResource: urlOffline, ofType: "html") {
                let url = URL(fileURLWithPath: filePath)
                uiView.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
            }
        }
    }
}

// 3. The main view that uses the WebView and passes the NetworkMonitor
struct ContentView: View {
    @StateObject private var networkMonitor = NetworkMonitor()

    var body: some View {
        WebView(
            urlOnline: "https://gormb.github.io/aniPublicOfficialReportSelfService/aniPublicOfficialReportSelfService_Html/wwwroot/EnHaandAaHoldeI/?rosassistent",
            urlOffline: "startside",
            networkMonitor: networkMonitor
        )
        .ignoresSafeArea()
    }
}

#Preview {
    ContentView()
}
