Write-Host "├── Deploy and configure software for EHJ self-service"
$sw = Join-Path -Path $PSScriptRoot -ChildPath "sw"
$OllamaModel = "gpt-oss:20b"
& (Join-Path -Path $sw -ChildPath "Ollama\Ollama.exe") pull $OllamaModel | Out-Null
Start-Service -Name "FileZilla Server" -ErrorAction SilentlyContinue
Start-Process -FilePath (Join-Path -Path $sw -ChildPath "Python\python.exe") -ArgumentList @("$(Join-Path -Path $sw -ChildPath "21-httpserver.py")") -NoNewWindow

