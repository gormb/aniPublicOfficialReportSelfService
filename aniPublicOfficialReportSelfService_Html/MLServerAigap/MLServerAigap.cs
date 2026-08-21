using Microsoft.AspNetCore.Http.Features;

public class MLServerAigap : IWebHost {
    public MLServerAigap() : base() { }     
    public class ServerInfoAttribute : List<KeyValuePair<string, string>>
    {
    }
    public class ServerInfo : List<ServerInfoAttribute>
    {
        public bool bStarted = false;
    }
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
            public RemoteOllama(){}
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
        bool Init()
        {
            // Start http://localhost:1234, load models, list models
            // Start ollama http://localhost:1234
            remoteServerCollection.Add(new RemoteOllama());
            // list models on http://api.openai.com
            // list models on http://api.mistral.com
            // list models on http://localhost
            return true;
        }
        bool CleanUp()
        {
            // Start http://localhost:1234, load models, list models
            // Start ollama http://localhost:1234
            // list models on http://api.openai.com
            // list models on http://api.mistral.com
            return true;
        }
        static int ServerProc()
        {
            // Redirect all post requests from http://localhost:2468 to http://localhost:1234
            // Redirect all post requests from http://localhost:2468 to http://api.openai.com, map Bearer to openai Bearer
            // Redirect all post requests from http://localhost:2468 to http://api.mistral.com, map Bearer to mistral Bearer
            return 0;
        }
    }
    List<LocalServer> LocalServerCollection = new List<LocalServer>();
    public IFeatureCollection ServerFeatures => throw new NotImplementedException();
    public IServiceProvider Services => throw new NotImplementedException();

    bool Install() { throw new NotImplementedException("Install"); }
    bool Serve()
    {
        Console.WriteLine("Started!");
        return true;
    }
    void Main()
    {
        Install();
        Serve();
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
