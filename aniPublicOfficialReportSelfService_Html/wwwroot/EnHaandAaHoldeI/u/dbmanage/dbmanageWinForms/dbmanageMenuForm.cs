using System;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace dbmanageWinForms
{
    public partial class dbmanageMenuForm : Form
    {
        #region Supabase
        protected class Supabase
        {
            public class Config
            {
                public string Url, UrlBase, User, Password, Token, Activeproject;
                public string OrgId = "?";
                public Config() { Url = UrlBase = User = Password = Token = Activeproject = "?"; }
                public void Clear() { Url = UrlBase = User = Password = Token = Activeproject = "?"; }
                static string Enc(string s) => Convert.ToBase64String(ProtectedData.Protect(Encoding.UTF8.GetBytes(s), null, DataProtectionScope.CurrentUser));
                static string Dec(string s) => Encoding.UTF8.GetString(ProtectedData.Unprotect(Convert.FromBase64String(s), null, DataProtectionScope.CurrentUser));
                public string ToStringEnc()
                {
                    return $"{Url}\n{UrlBase}\n{User}\n{Enc(Password)}\n{Enc(Token)}\n{Activeproject}";
                }
                public override string ToString()
                {
                    return $"{Url}\n{UrlBase}\n{User}\n{Password}\n{Token}\n{Activeproject}";
                }
                public void SaveI() => File.WriteAllText(Path, ToStringEnc());
                public bool Save()
                {
                    try { SaveI(); } catch (Exception) { return false; }
                    return true;
                }
                public void LoadI()
                {
                    var lines = File.ReadAllLines(Path);
                    Url = lines[0];
                    UrlBase = lines[1];
                    User = lines[2];
                    Password = Dec(lines[3]);
                    Token = Dec(lines[4]);
                    Activeproject = lines?[5] ?? "?";
                }
                private static string Path => Environment.ProcessPath + ".csv";
            }
            public Config config;
            public class Comm
            {
                private readonly Supabase supabase;
                private static readonly HttpClient http = new();
                public Comm(Supabase p) { supabase = p; }

                public class Org
                {
                    public string Name, Id;
                    public Org(string n, string i) { Name = n; Id = i; }
                    public override string ToString() => Name + " (" + Id + ")";
                }

                public class Project
                {
                    public string Name, Id;
                    public Project(string n, string i) { Name = n; Id = i; }
                    public override string ToString() => Name;
                }

                public Org[] orgs = new[] { new Org("?", "?") };

                // Load organizations and then projects for the first org.
                public async Task Org_Load()
                {
                    http.DefaultRequestHeaders.Authorization = new("Bearer", supabase.config.Token);
                    var json = await http.GetStringAsync("https://api.supabase.com/v1/organizations");
                    using var doc = JsonDocument.Parse(json);
                    orgs = doc.RootElement.EnumerateArray()
                        .Select(o => new Org(o.GetProperty("name").GetString(), o.GetProperty("id").GetString()))
                        .ToArray();

                    if (orgs.Length > 0)
                        await Projects_LoadForOrg(orgs[0].Id);
                    // notify form that orgs are loaded
                    supabase.form.supabase_OrgsLoaded();
                }

                public async Task<string> Projects_Raw()
                {
                    http.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", supabase.config.Token);
                    return await http.GetStringAsync("https://api.supabase.com/v1/projects");
                }

                // Download projects and add those belonging to orgId to the form placeholderListbox.
                public async Task Projects_LoadForOrg(string orgId)
                {
                    var resp = await Projects_Raw();
                    using var doc = JsonDocument.Parse(resp);
                    var projects = doc.RootElement.EnumerateArray()
                        .Where(p => p.TryGetProperty("organization_id", out var v) && v.GetString() == orgId)
                        .Select(p => new Project(p.GetProperty("name").GetString(), p.GetProperty("id").GetString()))
                        .ToArray();
                    supabase.form.listBoxSupabaseProjects.Items.Clear();
                    supabase.form.listBoxSupabaseProjects.Items.AddRange(projects);
                }

                public object[] Projects()
                {
                    var resp = Projects_Raw().GetAwaiter().GetResult();
                    return JsonSerializer.Deserialize<object[]>(resp) ?? Array.Empty<object>();
                }
            }

            public Comm comm;
            public dbmanageMenuForm form;
            public Supabase(dbmanageMenuForm _form)
            {
                form = _form;
                config = new();
                comm = new Comm(this);
            }
            public bool Load()
            {
                try { config.LoadI(); } catch (Exception) { return false; }
                Task task = comm.Org_Load();
                return true;
            }
        }
        protected Supabase supabase;
        #endregion Supabase

        #region Helpers
        protected bool bFirstActivation = true;
        private bool bDirty = false;
        protected bool Dirty
        {
            get { return bDirty; }
            set
            {
                bDirty = value;
                Text = "Database Management Menu" + (bDirty ? " *" : "");
            }
        }
        private void dbmanageMenuForm_Activated(object sender, EventArgs e)
        {
            if (bFirstActivation)
            {
                bFirstActivation = false;
                supabase = new(this);
                if (!ConfigLoad())
                {
                    ConfigSave();
                    ConfigLoad();
                }
            }
        }
        bool bLoadSaveBusy = false;
        private bool ConfigLoad(bool bUpdUi = true)
        {
            if (!supabase.Load())
                return false;
            else if (bUpdUi && !bLoadSaveBusy)
            {
                bLoadSaveBusy = true;
                textBoxSupabaseUrl.Text = supabase.config.Url;
                comboBoxSupabaseUrlBase.Text = supabase.config.UrlBase;
                textBoxSupabaseUser.Text = supabase.config.User;
                textBoxSupabasePassword.Text = supabase.config.Password;
                textBoxSupabaseToken.Text = supabase.config.Token;
                SetProjLbVal(supabase.config.Activeproject);
                Dirty = false;
                bLoadSaveBusy = false;
            }
            return true;
        }
        private bool ConfigSave(bool bUpdFromUi = true)
        {
            if (bUpdFromUi && !bLoadSaveBusy)
            {
                bLoadSaveBusy = true;
                supabase.config.Url = textBoxSupabaseUrl.Text;
                supabase.config.UrlBase = comboBoxSupabaseUrlBase.Text;
                supabase.config.User = textBoxSupabaseUser.Text;
                supabase.config.Password = textBoxSupabasePassword.Text;
                supabase.config.Token = textBoxSupabaseToken.Text;
                supabase.config.Activeproject = GetProjLbVal();
                bLoadSaveBusy = false;
            }
            bool bRes = supabase.config.Save();
            if (bRes)
                Dirty = false;
            return bRes;
        }
        private int SetProjLbVal(string projName)
        {
            int i = listBoxSupabaseProjects.Items.IndexOf(projName);
            listBoxSupabaseProjects.SelectedIndex = i;
            return i;
        }
        private string GetProjLbVal()
        {
            if (listBoxSupabaseProjects.SelectedIndex != -1)
                return listBoxSupabaseProjects.SelectedItem.ToString();
            return "?";
        }
        private void SettingsChanged()
        {
            if (!bFirstActivation)
                if (checkBoxSupabaseSettingsAutosave.Checked) ConfigSave();
                else Dirty = true;
        }
        public void supabase_OrgsLoaded()
        {
            var prev = comboBoxSupabaseActiveOrg.Text;
            comboBoxSupabaseActiveOrg.Items.Clear();
            comboBoxSupabaseActiveOrg.Items.AddRange(supabase.comm.orgs);
            if (comboBoxSupabaseActiveOrg.Items.Count == 0)
                comboBoxSupabaseActiveOrg.Items.Add("?");
            comboBoxSupabaseActiveOrg.Text = prev;
            if (comboBoxSupabaseActiveOrg.SelectedIndex == -1)
                comboBoxSupabaseActiveOrg.SelectedIndex = 0;
        }

        public void listBoxSupabaseProjects_AddRange(object[] items)
        {
            listBoxSupabaseProjects.Items.Clear();
            listBoxSupabaseProjects.Items.AddRange(items);
        }

        #endregion Helpers
        public dbmanageMenuForm()
        {
            InitializeComponent();
        }
        private void textBoxSupabaseUrl_TextChanged(object sender, EventArgs e)
        {
            SettingsChanged();
        }
        private void textBoxSupabaseUser_TextChanged(object sender, EventArgs e)
        {
            SettingsChanged();
        }
        private void textBoxSupabasePassword_TextChanged(object sender, EventArgs e)
        {
            SettingsChanged();
        }
        private void comboBoxSupabaseUrlBase_SelectedIndexChanged(object sender, EventArgs e)
        {
            SettingsChanged();
        }
        private void textBoxSupabaseToken_TextChanged(object sender, EventArgs e)
        {
            SettingsChanged();
        }
        private void comboBoxSupabaseUrlBase_TextChanged(object sender, EventArgs e)
        {
            SettingsChanged();
        }
        private void comboBoxSupabaseActiveProject_TextChanged(object sender, EventArgs e)
        {
            SettingsChanged();
        }
        private void comboBoxSupabaseActiveProject_SelectedIndexChanged(object sender, EventArgs e)
        {
            SettingsChanged();
        }
        private void checkBoxSupabaseSettingsAutosave_CheckedChanged(object sender, EventArgs e)
        {
            if (checkBoxSupabaseSettingsAutosave.Checked)
                ConfigSave();
            openToolStripMenuItem.Enabled =
                saveToolStripMenuItem.Enabled = !checkBoxSupabaseSettingsAutosave.Checked;
        }
        private void newToolStripMenuItem_Click(object sender, EventArgs e)
        {
            textBoxSupabaseUrl.Text = comboBoxSupabaseUrlBase.Text = textBoxSupabaseUser.Text = textBoxSupabasePassword.Text = textBoxSupabaseToken.Text = "?";
        }
        private void openToolStripMenuItem_Click(object sender, EventArgs e)
        {
            ConfigLoad();
        }
        private void saveToolStripMenuItem_Click(object sender, EventArgs e)
        {
            ConfigSave();
        }
        private void exitToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Close();
        }
        private void dbmanageMenuForm_FormClosing(object sender, FormClosingEventArgs e)
        {
            if (Dirty)
            {
                var dr = MessageBox.Show("There are unsaved changes. Do you want to save them before exiting?", "Unsaved Changes", MessageBoxButtons.YesNoCancel, MessageBoxIcon.Warning);
                if (dr == DialogResult.Cancel)
                    e.Cancel = true;
                else if (dr == DialogResult.Yes)
                    ConfigSave();
            }
        }
        private bool CopyResultedInCopyAll()
        {
            bool bRes = !(ActiveControl is TextBoxBase);
            Clipboard.SetText(ActiveControl is TextBoxBase ct
                ? ct.SelectedText
                : (new string[] { textBoxSupabaseUrl.Text,
                    comboBoxSupabaseUrlBase.Text,
                    textBoxSupabaseUser.Text,
                    textBoxSupabasePassword.Text,
                    textBoxSupabaseToken.Text,
                    GetProjLbVal()
                }).Aggregate((a, b) => a + "\n" + b));
            return bRes;
        }
        private void cutToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (CopyResultedInCopyAll())
                copyToolStripMenuItem.PerformClick();
        }
        private void copyToolStripMenuItem_Click(object sender, EventArgs e)
        {
            CopyResultedInCopyAll();
        }
        private void pasteToolStripMenuItem_Click(object sender, EventArgs e)
        {
            string[] lines = Clipboard.GetText().Split('\n');
            if (lines.Length == 1 && ActiveControl is TextBoxBase ct)
                ct.Paste();
            else if (lines.Length < 5)
                MessageBox.Show("Clipboard can be used with minmum five lines to paste all settings or inside a text-based control");
            else
            {
                textBoxSupabaseUrl.Text = lines[0];
                comboBoxSupabaseUrlBase.Text = lines[1];
                textBoxSupabaseUser.Text = lines[2];
                textBoxSupabasePassword.Text = lines[3];
                textBoxSupabaseToken.Text = lines[4];
                if (lines.Length > 5)
                    SetProjLbVal(lines[5]);
            }
        }
        private void undoToolStripMenuItem_Click(object sender, EventArgs e)
        {
            throw new NotImplementedException();
        }
        private void redoToolStripMenuItem_Click(object sender, EventArgs e)
        {
            throw new NotImplementedException();
        }
        private void selectAllToolStripMenuItem_Click(object sender, EventArgs e)
        {
            throw new NotImplementedException();
        }
        private void saveAsToolStripMenuItem_Click(object sender, EventArgs e)
        {
            throw new NotImplementedException();
        }
        private void printToolStripMenuItem_Click(object sender, EventArgs e)
        {
            throw new NotImplementedException();
        }
        private void printPreviewToolStripMenuItem_Click(object sender, EventArgs e)
        {
            throw new NotImplementedException();
        }
        private void customizeToolStripMenuItem_Click(object sender, EventArgs e)
        {
            throw new NotImplementedException();
        }
        private void optionsToolStripMenuItem_Click(object sender, EventArgs e)
        {
            throw new NotImplementedException();
        }
        private void contentsToolStripMenuItem_Click(object sender, EventArgs e)
        {
            throw new NotImplementedException();
        }
        private void indexToolStripMenuItem_Click(object sender, EventArgs e)
        {
            throw new NotImplementedException();
        }
        private void searchToolStripMenuItem_Click(object sender, EventArgs e)
        {
            throw new NotImplementedException();
        }
        private void aboutToolStripMenuItem_Click(object sender, EventArgs e)
        {
            throw new NotImplementedException();
        }

        private void tokenTestToolStripMenuItem_Click(object sender, EventArgs e)
        {
            // Test Supabase token
            throw new NotImplementedException();
        }

        private void helloWorldProjectTestToolStripMenuItem_Click(object sender, EventArgs e)
        {
            // Connect to "Hello World" - project
            throw new NotImplementedException();
        }

        private void comboBoxSupabaseActiveOrg_SelectedIndexChanged(object sender, EventArgs e)
        {
            throw new NotImplementedException();
        }

        private void listBoxSupabaseProjects_SelectedIndexChanged(object sender, EventArgs e)
        {
            // Clicked on box? then set active project and 
        }
    }
}