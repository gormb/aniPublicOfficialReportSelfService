namespace dbmanageWinForms
{
    partial class dbmanageMenuForm
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(dbmanageMenuForm));
            menuStrip1 = new MenuStrip();
            fileToolStripMenuItem = new ToolStripMenuItem();
            newToolStripMenuItem = new ToolStripMenuItem();
            openToolStripMenuItem = new ToolStripMenuItem();
            toolStripSeparator = new ToolStripSeparator();
            saveToolStripMenuItem = new ToolStripMenuItem();
            saveAsToolStripMenuItem = new ToolStripMenuItem();
            toolStripSeparator1 = new ToolStripSeparator();
            printToolStripMenuItem = new ToolStripMenuItem();
            printPreviewToolStripMenuItem = new ToolStripMenuItem();
            toolStripSeparator2 = new ToolStripSeparator();
            exitToolStripMenuItem = new ToolStripMenuItem();
            editToolStripMenuItem = new ToolStripMenuItem();
            undoToolStripMenuItem = new ToolStripMenuItem();
            redoToolStripMenuItem = new ToolStripMenuItem();
            toolStripSeparator3 = new ToolStripSeparator();
            cutToolStripMenuItem = new ToolStripMenuItem();
            copyToolStripMenuItem = new ToolStripMenuItem();
            pasteToolStripMenuItem = new ToolStripMenuItem();
            toolStripSeparator4 = new ToolStripSeparator();
            selectAllToolStripMenuItem = new ToolStripMenuItem();
            toolsToolStripMenuItem = new ToolStripMenuItem();
            toolStripMenuItem1 = new ToolStripSeparator();
            tokenTestToolStripMenuItem = new ToolStripMenuItem();
            helloWorldProjectTestToolStripMenuItem = new ToolStripMenuItem();
            toolStripMenuItem2 = new ToolStripSeparator();
            customizeToolStripMenuItem = new ToolStripMenuItem();
            optionsToolStripMenuItem = new ToolStripMenuItem();
            helpToolStripMenuItem = new ToolStripMenuItem();
            contentsToolStripMenuItem = new ToolStripMenuItem();
            indexToolStripMenuItem = new ToolStripMenuItem();
            searchToolStripMenuItem = new ToolStripMenuItem();
            toolStripSeparator5 = new ToolStripSeparator();
            aboutToolStripMenuItem = new ToolStripMenuItem();
            statusStrip1 = new StatusStrip();
            toolStripStatusLabel = new ToolStripStatusLabel();
            tabControl = new TabControl();
            tabPageConfig = new TabPage();
            comboBoxSupabaseActiveOrg = new ComboBox();
            label5 = new Label();
            groupBox1 = new GroupBox();
            comboBoxSupabaseActiveProject = new ComboBox();
            label4 = new Label();
            checkBoxSupabaseSettingsAutosave = new CheckBox();
            textBoxSupabaseToken = new TextBox();
            label3 = new Label();
            comboBoxSupabaseUrlBase = new ComboBox();
            label2 = new Label();
            label1 = new Label();
            textBoxSupabaseUrl = new TextBox();
            textBoxSupabasePassword = new TextBox();
            textBoxSupabaseUser = new TextBox();
            tabPageTest = new TabPage();
            menuStrip1.SuspendLayout();
            statusStrip1.SuspendLayout();
            tabControl.SuspendLayout();
            tabPageConfig.SuspendLayout();
            SuspendLayout();
            // 
            // menuStrip1
            // 
            menuStrip1.ImageScalingSize = new Size(24, 24);
            menuStrip1.Items.AddRange(new ToolStripItem[] { fileToolStripMenuItem, editToolStripMenuItem, toolsToolStripMenuItem, helpToolStripMenuItem });
            menuStrip1.Location = new Point(0, 0);
            menuStrip1.Name = "menuStrip1";
            menuStrip1.Size = new Size(1038, 33);
            menuStrip1.TabIndex = 1;
            menuStrip1.Text = "menuStrip1";
            // 
            // fileToolStripMenuItem
            // 
            fileToolStripMenuItem.DropDownItems.AddRange(new ToolStripItem[] { newToolStripMenuItem, openToolStripMenuItem, toolStripSeparator, saveToolStripMenuItem, saveAsToolStripMenuItem, toolStripSeparator1, printToolStripMenuItem, printPreviewToolStripMenuItem, toolStripSeparator2, exitToolStripMenuItem });
            fileToolStripMenuItem.Name = "fileToolStripMenuItem";
            fileToolStripMenuItem.Size = new Size(54, 29);
            fileToolStripMenuItem.Text = "&File";
            // 
            // newToolStripMenuItem
            // 
            newToolStripMenuItem.Image = (Image)resources.GetObject("newToolStripMenuItem.Image");
            newToolStripMenuItem.ImageTransparentColor = Color.Magenta;
            newToolStripMenuItem.Name = "newToolStripMenuItem";
            newToolStripMenuItem.ShortcutKeys = Keys.Control | Keys.N;
            newToolStripMenuItem.Size = new Size(223, 34);
            newToolStripMenuItem.Text = "&New";
            newToolStripMenuItem.Click += newToolStripMenuItem_Click;
            // 
            // openToolStripMenuItem
            // 
            openToolStripMenuItem.Image = (Image)resources.GetObject("openToolStripMenuItem.Image");
            openToolStripMenuItem.ImageTransparentColor = Color.Magenta;
            openToolStripMenuItem.Name = "openToolStripMenuItem";
            openToolStripMenuItem.ShortcutKeys = Keys.Control | Keys.O;
            openToolStripMenuItem.Size = new Size(223, 34);
            openToolStripMenuItem.Text = "&Open";
            openToolStripMenuItem.Click += openToolStripMenuItem_Click;
            // 
            // toolStripSeparator
            // 
            toolStripSeparator.Name = "toolStripSeparator";
            toolStripSeparator.Size = new Size(220, 6);
            // 
            // saveToolStripMenuItem
            // 
            saveToolStripMenuItem.Image = (Image)resources.GetObject("saveToolStripMenuItem.Image");
            saveToolStripMenuItem.ImageTransparentColor = Color.Magenta;
            saveToolStripMenuItem.Name = "saveToolStripMenuItem";
            saveToolStripMenuItem.ShortcutKeys = Keys.Control | Keys.S;
            saveToolStripMenuItem.Size = new Size(223, 34);
            saveToolStripMenuItem.Text = "&Save";
            saveToolStripMenuItem.Click += saveToolStripMenuItem_Click;
            // 
            // saveAsToolStripMenuItem
            // 
            saveAsToolStripMenuItem.Enabled = false;
            saveAsToolStripMenuItem.Name = "saveAsToolStripMenuItem";
            saveAsToolStripMenuItem.Size = new Size(223, 34);
            saveAsToolStripMenuItem.Text = "Save &As";
            saveAsToolStripMenuItem.Click += saveAsToolStripMenuItem_Click;
            // 
            // toolStripSeparator1
            // 
            toolStripSeparator1.Name = "toolStripSeparator1";
            toolStripSeparator1.Size = new Size(220, 6);
            // 
            // printToolStripMenuItem
            // 
            printToolStripMenuItem.Enabled = false;
            printToolStripMenuItem.Image = (Image)resources.GetObject("printToolStripMenuItem.Image");
            printToolStripMenuItem.ImageTransparentColor = Color.Magenta;
            printToolStripMenuItem.Name = "printToolStripMenuItem";
            printToolStripMenuItem.ShortcutKeys = Keys.Control | Keys.P;
            printToolStripMenuItem.Size = new Size(223, 34);
            printToolStripMenuItem.Text = "&Print";
            printToolStripMenuItem.Click += printToolStripMenuItem_Click;
            // 
            // printPreviewToolStripMenuItem
            // 
            printPreviewToolStripMenuItem.Enabled = false;
            printPreviewToolStripMenuItem.Image = (Image)resources.GetObject("printPreviewToolStripMenuItem.Image");
            printPreviewToolStripMenuItem.ImageTransparentColor = Color.Magenta;
            printPreviewToolStripMenuItem.Name = "printPreviewToolStripMenuItem";
            printPreviewToolStripMenuItem.Size = new Size(223, 34);
            printPreviewToolStripMenuItem.Text = "Print Pre&view";
            printPreviewToolStripMenuItem.Click += printPreviewToolStripMenuItem_Click;
            // 
            // toolStripSeparator2
            // 
            toolStripSeparator2.Name = "toolStripSeparator2";
            toolStripSeparator2.Size = new Size(220, 6);
            // 
            // exitToolStripMenuItem
            // 
            exitToolStripMenuItem.Name = "exitToolStripMenuItem";
            exitToolStripMenuItem.Size = new Size(223, 34);
            exitToolStripMenuItem.Text = "E&xit";
            exitToolStripMenuItem.Click += exitToolStripMenuItem_Click;
            // 
            // editToolStripMenuItem
            // 
            editToolStripMenuItem.DropDownItems.AddRange(new ToolStripItem[] { undoToolStripMenuItem, redoToolStripMenuItem, toolStripSeparator3, cutToolStripMenuItem, copyToolStripMenuItem, pasteToolStripMenuItem, toolStripSeparator4, selectAllToolStripMenuItem });
            editToolStripMenuItem.Name = "editToolStripMenuItem";
            editToolStripMenuItem.Size = new Size(58, 29);
            editToolStripMenuItem.Text = "&Edit";
            // 
            // undoToolStripMenuItem
            // 
            undoToolStripMenuItem.Enabled = false;
            undoToolStripMenuItem.Name = "undoToolStripMenuItem";
            undoToolStripMenuItem.ShortcutKeys = Keys.Control | Keys.Z;
            undoToolStripMenuItem.Size = new Size(219, 34);
            undoToolStripMenuItem.Text = "&Undo";
            undoToolStripMenuItem.Click += undoToolStripMenuItem_Click;
            // 
            // redoToolStripMenuItem
            // 
            redoToolStripMenuItem.Enabled = false;
            redoToolStripMenuItem.Name = "redoToolStripMenuItem";
            redoToolStripMenuItem.ShortcutKeys = Keys.Control | Keys.Y;
            redoToolStripMenuItem.Size = new Size(219, 34);
            redoToolStripMenuItem.Text = "&Redo";
            redoToolStripMenuItem.Click += redoToolStripMenuItem_Click;
            // 
            // toolStripSeparator3
            // 
            toolStripSeparator3.Name = "toolStripSeparator3";
            toolStripSeparator3.Size = new Size(216, 6);
            // 
            // cutToolStripMenuItem
            // 
            cutToolStripMenuItem.Image = (Image)resources.GetObject("cutToolStripMenuItem.Image");
            cutToolStripMenuItem.ImageTransparentColor = Color.Magenta;
            cutToolStripMenuItem.Name = "cutToolStripMenuItem";
            cutToolStripMenuItem.ShortcutKeys = Keys.Control | Keys.X;
            cutToolStripMenuItem.Size = new Size(219, 34);
            cutToolStripMenuItem.Text = "Cu&t";
            cutToolStripMenuItem.Click += cutToolStripMenuItem_Click;
            // 
            // copyToolStripMenuItem
            // 
            copyToolStripMenuItem.Image = (Image)resources.GetObject("copyToolStripMenuItem.Image");
            copyToolStripMenuItem.ImageTransparentColor = Color.Magenta;
            copyToolStripMenuItem.Name = "copyToolStripMenuItem";
            copyToolStripMenuItem.ShortcutKeys = Keys.Control | Keys.C;
            copyToolStripMenuItem.Size = new Size(219, 34);
            copyToolStripMenuItem.Text = "&Copy";
            copyToolStripMenuItem.Click += copyToolStripMenuItem_Click;
            // 
            // pasteToolStripMenuItem
            // 
            pasteToolStripMenuItem.Image = (Image)resources.GetObject("pasteToolStripMenuItem.Image");
            pasteToolStripMenuItem.ImageTransparentColor = Color.Magenta;
            pasteToolStripMenuItem.Name = "pasteToolStripMenuItem";
            pasteToolStripMenuItem.ShortcutKeys = Keys.Control | Keys.V;
            pasteToolStripMenuItem.Size = new Size(219, 34);
            pasteToolStripMenuItem.Text = "&Paste";
            pasteToolStripMenuItem.Click += pasteToolStripMenuItem_Click;
            // 
            // toolStripSeparator4
            // 
            toolStripSeparator4.Name = "toolStripSeparator4";
            toolStripSeparator4.Size = new Size(216, 6);
            // 
            // selectAllToolStripMenuItem
            // 
            selectAllToolStripMenuItem.Enabled = false;
            selectAllToolStripMenuItem.Name = "selectAllToolStripMenuItem";
            selectAllToolStripMenuItem.Size = new Size(219, 34);
            selectAllToolStripMenuItem.Text = "Select &All";
            selectAllToolStripMenuItem.Click += selectAllToolStripMenuItem_Click;
            // 
            // toolsToolStripMenuItem
            // 
            toolsToolStripMenuItem.DropDownItems.AddRange(new ToolStripItem[] { toolStripMenuItem1, tokenTestToolStripMenuItem, helloWorldProjectTestToolStripMenuItem, toolStripMenuItem2, customizeToolStripMenuItem, optionsToolStripMenuItem });
            toolsToolStripMenuItem.Name = "toolsToolStripMenuItem";
            toolsToolStripMenuItem.Size = new Size(69, 29);
            toolsToolStripMenuItem.Text = "&Tools";
            // 
            // toolStripMenuItem1
            // 
            toolStripMenuItem1.Name = "toolStripMenuItem1";
            toolStripMenuItem1.Size = new Size(299, 6);
            // 
            // tokenTestToolStripMenuItem
            // 
            tokenTestToolStripMenuItem.Name = "tokenTestToolStripMenuItem";
            tokenTestToolStripMenuItem.Size = new Size(302, 34);
            tokenTestToolStripMenuItem.Text = "&Token Test";
            tokenTestToolStripMenuItem.Click += tokenTestToolStripMenuItem_Click;
            // 
            // helloWorldProjectTestToolStripMenuItem
            // 
            helloWorldProjectTestToolStripMenuItem.Name = "helloWorldProjectTestToolStripMenuItem";
            helloWorldProjectTestToolStripMenuItem.Size = new Size(302, 34);
            helloWorldProjectTestToolStripMenuItem.Text = "Hello &World Project Test";
            helloWorldProjectTestToolStripMenuItem.Click += helloWorldProjectTestToolStripMenuItem_Click;
            // 
            // toolStripMenuItem2
            // 
            toolStripMenuItem2.Name = "toolStripMenuItem2";
            toolStripMenuItem2.Size = new Size(299, 6);
            // 
            // customizeToolStripMenuItem
            // 
            customizeToolStripMenuItem.Enabled = false;
            customizeToolStripMenuItem.Name = "customizeToolStripMenuItem";
            customizeToolStripMenuItem.Size = new Size(302, 34);
            customizeToolStripMenuItem.Text = "&Customize";
            customizeToolStripMenuItem.Click += customizeToolStripMenuItem_Click;
            // 
            // optionsToolStripMenuItem
            // 
            optionsToolStripMenuItem.Enabled = false;
            optionsToolStripMenuItem.Name = "optionsToolStripMenuItem";
            optionsToolStripMenuItem.Size = new Size(302, 34);
            optionsToolStripMenuItem.Text = "&Options";
            optionsToolStripMenuItem.Click += optionsToolStripMenuItem_Click;
            // 
            // helpToolStripMenuItem
            // 
            helpToolStripMenuItem.DropDownItems.AddRange(new ToolStripItem[] { contentsToolStripMenuItem, indexToolStripMenuItem, searchToolStripMenuItem, toolStripSeparator5, aboutToolStripMenuItem });
            helpToolStripMenuItem.Enabled = false;
            helpToolStripMenuItem.Name = "helpToolStripMenuItem";
            helpToolStripMenuItem.Size = new Size(65, 29);
            helpToolStripMenuItem.Text = "&Help";
            // 
            // contentsToolStripMenuItem
            // 
            contentsToolStripMenuItem.Name = "contentsToolStripMenuItem";
            contentsToolStripMenuItem.Size = new Size(185, 34);
            contentsToolStripMenuItem.Text = "&Contents";
            contentsToolStripMenuItem.Click += contentsToolStripMenuItem_Click;
            // 
            // indexToolStripMenuItem
            // 
            indexToolStripMenuItem.Name = "indexToolStripMenuItem";
            indexToolStripMenuItem.Size = new Size(185, 34);
            indexToolStripMenuItem.Text = "&Index";
            indexToolStripMenuItem.Click += indexToolStripMenuItem_Click;
            // 
            // searchToolStripMenuItem
            // 
            searchToolStripMenuItem.Name = "searchToolStripMenuItem";
            searchToolStripMenuItem.Size = new Size(185, 34);
            searchToolStripMenuItem.Text = "&Search";
            searchToolStripMenuItem.Click += searchToolStripMenuItem_Click;
            // 
            // toolStripSeparator5
            // 
            toolStripSeparator5.Name = "toolStripSeparator5";
            toolStripSeparator5.Size = new Size(182, 6);
            // 
            // aboutToolStripMenuItem
            // 
            aboutToolStripMenuItem.Name = "aboutToolStripMenuItem";
            aboutToolStripMenuItem.Size = new Size(185, 34);
            aboutToolStripMenuItem.Text = "&About...";
            aboutToolStripMenuItem.Click += aboutToolStripMenuItem_Click;
            // 
            // statusStrip1
            // 
            statusStrip1.ImageScalingSize = new Size(24, 24);
            statusStrip1.Items.AddRange(new ToolStripItem[] { toolStripStatusLabel });
            statusStrip1.Location = new Point(0, 541);
            statusStrip1.Name = "statusStrip1";
            statusStrip1.Size = new Size(1038, 32);
            statusStrip1.TabIndex = 2;
            statusStrip1.Text = "statusStrip1";
            // 
            // toolStripStatusLabel
            // 
            toolStripStatusLabel.Name = "toolStripStatusLabel";
            toolStripStatusLabel.Size = new Size(41, 25);
            toolStripStatusLabel.Text = "Idle";
            // 
            // tabControl
            // 
            tabControl.Controls.Add(tabPageConfig);
            tabControl.Controls.Add(tabPageTest);
            tabControl.Dock = DockStyle.Fill;
            tabControl.Location = new Point(0, 33);
            tabControl.Name = "tabControl";
            tabControl.SelectedIndex = 0;
            tabControl.Size = new Size(1038, 508);
            tabControl.TabIndex = 3;
            // 
            // tabPageConfig
            // 
            tabPageConfig.Controls.Add(comboBoxSupabaseActiveOrg);
            tabPageConfig.Controls.Add(label5);
            tabPageConfig.Controls.Add(groupBox1);
            tabPageConfig.Controls.Add(comboBoxSupabaseActiveProject);
            tabPageConfig.Controls.Add(label4);
            tabPageConfig.Controls.Add(checkBoxSupabaseSettingsAutosave);
            tabPageConfig.Controls.Add(textBoxSupabaseToken);
            tabPageConfig.Controls.Add(label3);
            tabPageConfig.Controls.Add(comboBoxSupabaseUrlBase);
            tabPageConfig.Controls.Add(label2);
            tabPageConfig.Controls.Add(label1);
            tabPageConfig.Controls.Add(textBoxSupabaseUrl);
            tabPageConfig.Controls.Add(textBoxSupabasePassword);
            tabPageConfig.Controls.Add(textBoxSupabaseUser);
            tabPageConfig.Location = new Point(4, 34);
            tabPageConfig.Name = "tabPageConfig";
            tabPageConfig.Padding = new Padding(3);
            tabPageConfig.Size = new Size(1030, 470);
            tabPageConfig.TabIndex = 0;
            tabPageConfig.Text = "Config";
            tabPageConfig.UseVisualStyleBackColor = true;
            // 
            // comboBoxSupabaseActiveOrg
            // 
            comboBoxSupabaseActiveOrg.DropDownStyle = ComboBoxStyle.DropDownList;
            comboBoxSupabaseActiveOrg.FormattingEnabled = true;
            comboBoxSupabaseActiveOrg.Items.AddRange(new object[] { "Loafing..." });
            comboBoxSupabaseActiveOrg.Location = new Point(680, 86);
            comboBoxSupabaseActiveOrg.Name = "comboBoxSupabaseActiveOrg";
            comboBoxSupabaseActiveOrg.Size = new Size(248, 33);
            comboBoxSupabaseActiveOrg.TabIndex = 5;
            // 
            // label5
            // 
            label5.AutoSize = true;
            label5.Location = new Point(486, 94);
            label5.Name = "label5";
            label5.Size = new Size(164, 25);
            label5.TabIndex = 11;
            label5.Text = "Active organization";
            // 
            // groupBox1
            // 
            groupBox1.Location = new Point(486, 271);
            groupBox1.Name = "groupBox1";
            groupBox1.Size = new Size(442, 174);
            groupBox1.TabIndex = 10;
            groupBox1.TabStop = false;
            groupBox1.Text = "?";
            // 
            // comboBoxSupabaseActiveProject
            // 
            comboBoxSupabaseActiveProject.FormattingEnabled = true;
            comboBoxSupabaseActiveProject.Location = new Point(680, 174);
            comboBoxSupabaseActiveProject.Name = "comboBoxSupabaseActiveProject";
            comboBoxSupabaseActiveProject.Size = new Size(248, 33);
            comboBoxSupabaseActiveProject.TabIndex = 6;
            comboBoxSupabaseActiveProject.Text = "Loading...";
            comboBoxSupabaseActiveProject.SelectedIndexChanged += comboBoxSupabaseActiveProject_SelectedIndexChanged;
            comboBoxSupabaseActiveProject.TextChanged += comboBoxSupabaseActiveProject_TextChanged;
            // 
            // label4
            // 
            label4.AutoSize = true;
            label4.Location = new Point(486, 176);
            label4.Name = "label4";
            label4.Size = new Size(120, 25);
            label4.TabIndex = 8;
            label4.Text = "Active project";
            // 
            // checkBoxSupabaseSettingsAutosave
            // 
            checkBoxSupabaseSettingsAutosave.AutoSize = true;
            checkBoxSupabaseSettingsAutosave.Location = new Point(270, 43);
            checkBoxSupabaseSettingsAutosave.Name = "checkBoxSupabaseSettingsAutosave";
            checkBoxSupabaseSettingsAutosave.Size = new Size(112, 29);
            checkBoxSupabaseSettingsAutosave.TabIndex = 7;
            checkBoxSupabaseSettingsAutosave.Text = "Autosave";
            checkBoxSupabaseSettingsAutosave.UseVisualStyleBackColor = true;
            checkBoxSupabaseSettingsAutosave.CheckedChanged += checkBoxSupabaseSettingsAutosave_CheckedChanged;
            // 
            // textBoxSupabaseToken
            // 
            textBoxSupabaseToken.Location = new Point(32, 88);
            textBoxSupabaseToken.Name = "textBoxSupabaseToken";
            textBoxSupabaseToken.PasswordChar = '*';
            textBoxSupabaseToken.Size = new Size(350, 31);
            textBoxSupabaseToken.TabIndex = 4;
            textBoxSupabaseToken.Text = "Loading...";
            textBoxSupabaseToken.TextChanged += textBoxSupabaseToken_TextChanged;
            // 
            // label3
            // 
            label3.AutoSize = true;
            label3.Location = new Point(32, 47);
            label3.Name = "label3";
            label3.Size = new Size(58, 25);
            label3.TabIndex = 5;
            label3.Text = "Token";
            // 
            // comboBoxSupabaseUrlBase
            // 
            comboBoxSupabaseUrlBase.FormattingEnabled = true;
            comboBoxSupabaseUrlBase.Items.AddRange(new object[] { "supabase.co", "" });
            comboBoxSupabaseUrlBase.Location = new Point(232, 218);
            comboBoxSupabaseUrlBase.Name = "comboBoxSupabaseUrlBase";
            comboBoxSupabaseUrlBase.Size = new Size(150, 33);
            comboBoxSupabaseUrlBase.TabIndex = 1;
            comboBoxSupabaseUrlBase.Text = "supabase.co";
            comboBoxSupabaseUrlBase.SelectedIndexChanged += comboBoxSupabaseUrlBase_SelectedIndexChanged;
            comboBoxSupabaseUrlBase.TextChanged += comboBoxSupabaseUrlBase_TextChanged;
            // 
            // label2
            // 
            label2.AutoSize = true;
            label2.Location = new Point(27, 174);
            label2.Name = "label2";
            label2.Size = new Size(34, 25);
            label2.TabIndex = 4;
            label2.Text = "Url";
            // 
            // label1
            // 
            label1.AutoSize = true;
            label1.Location = new Point(27, 315);
            label1.Name = "label1";
            label1.Size = new Size(213, 25);
            label1.TabIndex = 3;
            label1.Text = "User name and password";
            // 
            // textBoxSupabaseUrl
            // 
            textBoxSupabaseUrl.Location = new Point(28, 218);
            textBoxSupabaseUrl.Name = "textBoxSupabaseUrl";
            textBoxSupabaseUrl.Size = new Size(171, 31);
            textBoxSupabaseUrl.TabIndex = 0;
            textBoxSupabaseUrl.Text = "Loading...";
            textBoxSupabaseUrl.TextChanged += textBoxSupabaseUrl_TextChanged;
            // 
            // textBoxSupabasePassword
            // 
            textBoxSupabasePassword.Location = new Point(232, 365);
            textBoxSupabasePassword.Name = "textBoxSupabasePassword";
            textBoxSupabasePassword.PasswordChar = '*';
            textBoxSupabasePassword.Size = new Size(150, 31);
            textBoxSupabasePassword.TabIndex = 3;
            textBoxSupabasePassword.Text = "Loading...";
            textBoxSupabasePassword.TextChanged += textBoxSupabasePassword_TextChanged;
            // 
            // textBoxSupabaseUser
            // 
            textBoxSupabaseUser.Location = new Point(28, 364);
            textBoxSupabaseUser.Name = "textBoxSupabaseUser";
            textBoxSupabaseUser.Size = new Size(171, 31);
            textBoxSupabaseUser.TabIndex = 2;
            textBoxSupabaseUser.Text = "Loading...";
            textBoxSupabaseUser.TextChanged += textBoxSupabaseUser_TextChanged;
            // 
            // tabPageTest
            // 
            tabPageTest.Location = new Point(4, 34);
            tabPageTest.Name = "tabPageTest";
            tabPageTest.Padding = new Padding(3);
            tabPageTest.Size = new Size(1030, 470);
            tabPageTest.TabIndex = 1;
            tabPageTest.Text = "Test";
            tabPageTest.UseVisualStyleBackColor = true;
            // 
            // dbmanageMenuForm
            // 
            AutoScaleDimensions = new SizeF(10F, 25F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(1038, 573);
            Controls.Add(tabControl);
            Controls.Add(statusStrip1);
            Controls.Add(menuStrip1);
            MainMenuStrip = menuStrip1;
            Name = "dbmanageMenuForm";
            Text = "Manage Supabase Database";
            Activated += dbmanageMenuForm_Activated;
            FormClosing += dbmanageMenuForm_FormClosing;
            menuStrip1.ResumeLayout(false);
            menuStrip1.PerformLayout();
            statusStrip1.ResumeLayout(false);
            statusStrip1.PerformLayout();
            tabControl.ResumeLayout(false);
            tabPageConfig.ResumeLayout(false);
            tabPageConfig.PerformLayout();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion
        private MenuStrip menuStrip1;
        private ToolStripMenuItem fileToolStripMenuItem;
        private ToolStripMenuItem newToolStripMenuItem;
        private ToolStripMenuItem openToolStripMenuItem;
        private ToolStripSeparator toolStripSeparator;
        private ToolStripMenuItem saveToolStripMenuItem;
        private ToolStripMenuItem saveAsToolStripMenuItem;
        private ToolStripSeparator toolStripSeparator1;
        private ToolStripMenuItem printToolStripMenuItem;
        private ToolStripMenuItem printPreviewToolStripMenuItem;
        private ToolStripSeparator toolStripSeparator2;
        private ToolStripMenuItem exitToolStripMenuItem;
        private ToolStripMenuItem editToolStripMenuItem;
        private ToolStripMenuItem undoToolStripMenuItem;
        private ToolStripMenuItem redoToolStripMenuItem;
        private ToolStripSeparator toolStripSeparator3;
        private ToolStripMenuItem cutToolStripMenuItem;
        private ToolStripMenuItem copyToolStripMenuItem;
        private ToolStripMenuItem pasteToolStripMenuItem;
        private ToolStripSeparator toolStripSeparator4;
        private ToolStripMenuItem selectAllToolStripMenuItem;
        private ToolStripMenuItem toolsToolStripMenuItem;
        private ToolStripMenuItem customizeToolStripMenuItem;
        private ToolStripMenuItem optionsToolStripMenuItem;
        private ToolStripMenuItem helpToolStripMenuItem;
        private ToolStripMenuItem contentsToolStripMenuItem;
        private ToolStripMenuItem indexToolStripMenuItem;
        private ToolStripMenuItem searchToolStripMenuItem;
        private ToolStripSeparator toolStripSeparator5;
        private ToolStripMenuItem aboutToolStripMenuItem;
        private StatusStrip statusStrip1;
        private TabControl tabControl;
        private TabPage tabPageConfig;
        private TabPage tabPageTest;
        private TextBox textBoxSupabaseUrl;
        private TextBox textBoxSupabasePassword;
        private TextBox textBoxSupabaseUser;
        private ComboBox comboBoxSupabaseUrlBase;
        private Label label2;
        private Label label1;
        private TextBox textBoxSupabaseToken;
        private Label label3;
        private CheckBox checkBoxSupabaseSettingsAutosave;
        private ToolStripSeparator toolStripMenuItem1;
        private ToolStripMenuItem tokenTestToolStripMenuItem;
        private ToolStripMenuItem helloWorldProjectTestToolStripMenuItem;
        private ToolStripSeparator toolStripMenuItem2;
        private Label label4;
        private GroupBox groupBox1;
        private ComboBox comboBoxSupabaseActiveProject;
        private ComboBox comboBoxSupabaseActiveOrg;
        private Label label5;
        private ToolStripStatusLabel toolStripStatusLabel;
    }
}
