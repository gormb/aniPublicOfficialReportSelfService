using Microsoft.AspNetCore.Http.Features;

public class MLServerAigap : IWebHost {
    public MLServerAigap(): base()    
    public class LocalServer : ServerInfo
    {
        public class Model
        {
            public Model(string name, string endpoint) {this.name = name; this.endpoint = endpoint;}
            public string name = "";
            public string endpoint= "";
        }
        public class RemoteServer
        {
            public List<Model> modelCollection = new List<Model>();
            public bool UpdateModels() { return false; }
        }
        public class RemoteOllama : RemoteServer
        {
            RemoteOllama(){}
        }
        public List<RemoteServer> remoteServerCollection = new List<RemoteServer>();
        public List<Model> modelCollection { get {
            List<Model> ret = new List<Model>();
            remoteServerCollection.ForEach((s)=>{ret.AddRange(s.modelCollection);});
            return ret;
            } 
        }
        public LocalServer()
        {
            Init();
            ServerProc();
            CleanUp();
        }
        public class ServerInfoAttribute : List<KeyValuePair<string, string>>
        {
        }
        public class ServerInfo : List<ServerInfoAttribute>
        {
            public bool bStarted = false;
        }
        bool Init()
        {
            // Start http://localhost:1234, load models, list models
            // Start ollama http://localhost:1234
            Remotes.Add(new RemoteOllama());
            // list models on http://api.openai.com
            Remotes.Add(new Remote("http://api.openai.com", "sk-123"));
            // list models on http://api.mistral.com
            Remotes.Add(new Remote("http://api.mistral.com", "sk-123"));
            // list models on http://localhost
            Remotes.Add(new Remote("http://localhost"));
        }
        bool CleanUp()
        {
            // Start http://localhost:1234, load models, list models
            // Start ollama http://localhost:1234
            // list models on http://api.openai.com
            // list models on http://api.mistral.com
        }
        static int ServerProc()
        {
            // Redirect all post requests from http://localhost:2468 to http://localhost:1234
            // Redirect all post requests from http://localhost:2468 to http://api.openai.com, map Bearer to openai Bearer
            // Redirect all post requests from http://localhost:2468 to http://api.mistral.com, map Bearer to mistral Bearer
        }
    }
    List<LocalServer> LocalServerCollection = new List<LocalServers>();
    public IFeatureCollection ServerFeatures => throw new NotImplementedException();
    public IServiceProvider Services => throw new NotImplementedException();

    bool Install() { throw new NotImplementedException("Install"); }
    bool Serve()
    {
        var s = new Server(this);
        Console.WriteLine("Started!");
        return true;
    }
    void Main()
    {
        Install();
        waitfor Serve();
        Console.WriteLine("Starting!");
    }

    public void Start()
    {
        throw new NotImplementedException();
    }

    public Task StartAsync(CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public Task StopAsync(CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public void Dispose()
    {
        throw new NotImplementedException();
    }
}

//{}
