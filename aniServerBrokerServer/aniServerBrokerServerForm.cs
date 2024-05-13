namespace aniServerBrokerServer
{
    public partial class aniServerBrokerServerForm : Form
    {
        public aniServerBrokerServerForm()
        {
            InitializeComponent();
        }
        private void button1_Click(object sender, EventArgs e)
        {
            throw new NotImplementedException();
        }
        private void buttonInstall_Click(object sender, EventArgs e)
        {   // $url = "https://ollama.com/download/OllamaSetup.exe"; $outputFile = "OllamaSetup.exe"; $installDir = "$env:ProgramFiles\Ollama"; if (-not (Test-Path $outputFile)) { Invoke-WebRequest -Uri $url -OutFile $outputFile }; if (-not (Test-Path $installDir)) { Start-Process -FilePath $outputFile -ArgumentList "/silent" -Wait }
            throw new NotImplementedException();
        }
        bool bActivatedFirst = true;
        private void formActivated(object sender, EventArgs e)
        {
            if (bActivatedFirst)
            {
                bActivatedFirst = false;
                // Add new row to the ListView with content in the columns "In", "Req", "Resp", "Out"
                listView1.Items.Add(new ListViewItem(new string[] { "In:models", "Req:models", "Resp:N/A", "Out:Not Available"}));

            }

        }
    }
}
