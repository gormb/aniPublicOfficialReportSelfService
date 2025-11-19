Write-Host "PrivHealth - Install, deploy/configure and Simulate Electronic Patient Journal"

param(
    [string[]]$Steps = @(
        "10-install.ps1",
        "20-deploy.ps1",
        "30-clean.ps1",
        "40-fillsimulate.ps1",
        "50-convert.ps1",
        "60-explain.ps1"
    )
)

# Kjør fra script-mappen
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "Master: starter kjøring av steg i $scriptDir"

foreach ($step in $Steps) {
    $path = Join-Path $scriptDir $step
    if (-Not (Test-Path $path)) {
        Write-Error "Fant ikke steg-script: $path"
        exit 1
    }
    Write-Host "==> Kjører $step"
    try {
        # Kjør i samme PowerShell-session
        & $path
        if ($LASTEXITCODE -ne 0) {
            throw "Steget returnerte exit code $LASTEXITCODE"
        }
    } catch {
        Write-Error "Feil under kjøring av $step : $_"
        exit 1
    }
}

Write-Host "Master: alle steg fullført."