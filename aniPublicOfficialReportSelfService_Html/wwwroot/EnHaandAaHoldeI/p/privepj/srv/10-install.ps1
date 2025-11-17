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

Write-Host "│   ├── FTP-server download and install"
# FileZilla Server.

Write-Host "│   ├── HTTP-server download and install"
# Python
# Python's built-in HTTP server.

Write-Host "│   ├── LLM-server download and install"
# ollama
