# todo

Write-Host "├── Install EHJ"
Write-Host "│   ├── FHIR File structure"

# ensure created file structure for downloaded Electronic Patient Journal
New-Item -ItemType Directory -Path ".\priv" -Force
New-Item -ItemType Directory -Path ".\priv\_raw" -Force
New-Item -ItemType Directory -Path ".\priv\_raw_processed" -Force
# ensure created file structure for marked-down Electronic Patient Journal files
New-Item -ItemType Directory -Path ".\priv\md" -Force
# FHIR file structure under md
# ├── Composition/
# │   ├── Comp-2024-10-25-Journal-77.md   <-- Hovedjournalen for 25. okt.
# │   └── Comp-2024-10-26-Journal-81.md   <-- Hovedjournalen for 26. okt.
# ├── DocumentReference/
# │   └── DocRef-2024-10-25-Original-PDF-5678.md   <-- Metadata om kildedokumentet
# ├── Observation/
# │   ├── Obs-2024-10-25-Journal-77-A.md     <-- Selve analysen/observasjonen (Vitale Tegn)
# │   └── Obs-2024-10-25-Journal-77-B.md     <-- Andre observasjoner (f.eks. Laboratorieresultat)
# ├── Patient/
# │   └── Patient-Context.md    <-- Metadata om pasient/studiekonteksten (uten dato, da den er statisk)
# └── Practitioner/
#     └── Practitioner-LLM-v1.md     <-- Metadata om hvem (LLM) som utførte analysen (uten dato)
New-Item -ItemType Directory -Path ".\priv\md\Composition" -Force
New-Item -ItemType Directory -Path ".\priv\md\DocumentReference" -Force
New-Item -ItemType Directory -Path ".\priv\md\Observation" -Force
New-Item -ItemType Directory -Path ".\priv\md\Patient" -Force
New-Item -ItemType Directory -Path ".\priv\md\Practitioner" -Force

Write-Host "│   ├── Python, FTP, HTTP and LLM servers, ensure downloaded"
$sw = Join-Path -Path $PSScriptRoot -ChildPath "sw"
if (-not (Test-Path $sw)) { New-Item -Path $sw -ItemType Directory | Out-Null }
@(
    @{Inst="Test-Path '$sw\Python\python.exe'"; Url="https://www.python.org/ftp/python/3.12.4/python-3.12.4-amd64.exe"; File="$sw\python-3.12.4-amd64.exe"; Args="/quiet InstallAllUsers=0 InstallLocation=`"$sw\Python`" PrependPath=1"},
    @{Inst="Test-Path '$sw\FileZilla Server\FileZilla Server.exe'"; Url="https://download.filezilla-project.org/server/FileZilla_Server-1.7.7-setup.exe"; File="$sw\FileZilla_Server-1.7.7-setup.exe"; Args="/S /D=`"$sw\FileZilla Server`""},
    @{Inst="Test-Path '$sw\Ollama\Ollama.exe'"; Url="https://ollama.com/download/Ollama-1.0.17-windows-x86_64.exe"; File="$sw\Ollama-1.0.17-windows-x86_64.exe"; Args="/S INSTALLDIR=`"$sw\Ollama`""}
) | ForEach-Object { 
    if ([string]::IsNullOrEmpty($_.Inst) -or (-not (Invoke-Expression $_.Inst))) {
        if (-not (Test-Path $_.File)) {
            Invoke-WebRequest -Uri $_.Url -OutFile $_.File -UseBasicParsing
        }        
        Start-Process -FilePath (Get-Item $_.File).FullName -ArgumentList $_.Args -Wait -NoNewWindow
    }
}


