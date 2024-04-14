
using Microsoft.AspNetCore.Http.Features;

public class MLServerAigap : IWebHost
{
    public class Server : ServerInfo
    {
        public class Model
        {
        }
        public class Remote
        {
            public List<Model> models = new List<Model>();
            public bool UpdateModels() { }
        }
        public class RemoteOllama : Remote
        {
        }
        #region Info about remote servers, their models, keys, etc.
        public List<Remote> Remotes = new List<Remote>();
        public List<Model> Models { get { return  } }
        public Server()
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
    List<Server> Servers = new List<Servers>();

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
