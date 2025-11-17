server for Windows

Step	Action Script (n0.ps1)	Test Script (n9.ps1)	Worker/Support Files (n1+.py)	Purpose of Step	Link (Local Path)	Spec URL (Standard)	State (0-9)
Master	00-all.ps1	09-alltest.ps1	None	Master Control: Orchestrate the entire workflow (00) and comprehensive testing (09).	/scripts/	/project_flow.md	0
1. Install	10-install.ps1	19-installtest.ps1	11-install_deps.py	Prerequisites: Install Python, LLM tools (Ollama), and document parsers (Tika/Pandoc).	/install/	https://docs.ollama.com/	0
2. Deploy	20-deploy.ps1	29-deploytest.ps1	21-config_servers.py	Setup: Configure servers (FTP root, start local HTTP server), and confirm Ollama API health.	http://localhost:8000/	https://pypi.org/project/tika/	0
3. Clean	30-clean.ps1	39-cleantest.ps1	31-stop_services.py	Reset: Stop services and clear all generated and ingested data to maintain a reproducible state.	/config/	/cleanup_protocol.txt	0
4. Simulate	40-fillsimulate.ps1	49-filltest.ps1	41-create_dummies.py	Data Simulation: Generate and place mock PDF, DOC, and TXT files into the ingestion folder.	ftp://localhost/docs/	/dummy_spec.json	1
5. Convert	50-convert.ps1	59-converttest.ps1	51-converter.py	Preprocessing: Extract text from raw files and save them as structured Markdown (.md) files in the logical EPJ analysis structure.	/epj/	/epj_structure.md	1
6. Analyze	60-explain.ps1	69-explaintest.ps1	61-analyzer.py	LLM Processing: Run LLM analysis on Markdown files and output the findings into new FHIR-like JSON explanation documents.

