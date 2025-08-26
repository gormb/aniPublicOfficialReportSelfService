import SwiftUI
import WebKit

// You're putting the WebView struct inside the same file.
struct WebView: UIViewRepresentable {
    let urlString: String

    func makeUIView(context: Context) -> WKWebView {
        return WKWebView()
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {
        if let url = URL(string: urlString) {
            let request = URLRequest(url: url)
            uiView.load(request)
        }
    }
}

struct ContentView: View {
    var body: some View {
        WebView(urlString: "https://gormb.github.io/aniPublicOfficialReportSelfService/aniPublicOfficialReportSelfService_Html/wwwroot/EnHaandAaHoldeI/?rosassistent")
            .ignoresSafeArea()
    }
}

#Preview {
    ContentView()
}
