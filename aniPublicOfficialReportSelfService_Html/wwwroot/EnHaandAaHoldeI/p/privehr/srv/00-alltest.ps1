# Master test-orchestrator: kjører alle tilhørende test-scripts i rekkefølge.
param(
    [string[]]$Tests = @(
        "19-installtest.ps1",
        "29-deploytest.ps1",
        "39-cleantest.ps1",
        "49-filltest.ps1",
        "59-converttest.ps1",
        "69-explaintest.ps1"
    )
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "Master-test: starter kjøring av test-scripts i $scriptDir"

foreach ($test in $Tests) {
    $path = Join-Path $scriptDir $test
    if (-Not (Test-Path $path)) {
        Write-Error "Fant ikke test-script: $path"
        exit 1
    }
    Write-Host "==> Kjører test $test"
    try {
        & $path
        if ($LASTEXITCODE -ne 0) {
            throw "Test returnerte exit code $LASTEXITCODE"
        }
    } catch {
        Write-Error "Feil under kjøring av test $test : $_"
        exit 1
    }
}

Write-Host "Master-test: alle tester fullført."