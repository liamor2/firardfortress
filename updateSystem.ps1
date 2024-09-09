# Define variables
$repoUrl = "https://github.com/liamor2/firardfortress.git"  # URL of the GitHub repository
$repoTmpPath = Join-Path -Path $PSScriptRoot -ChildPath "repotmp"  # Temporary path for cloned repository
$targetFolder = $PSScriptRoot  # Target folder is the folder where the script is located

# Check if git is installed
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git is not installed. Please install Git to continue." -ForegroundColor Red
    exit
}

# Remove any existing 'repotmp' folder from previous runs
if (Test-Path $repoTmpPath) {
    Write-Host "Removing existing 'repotmp' folder from previous run..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $repoTmpPath
}

# Clone the repository into 'repotmp' folder
Write-Host "Cloning repository into 'repotmp'..." -ForegroundColor Green
git clone $repoUrl $repoTmpPath

# Check if the repository was successfully cloned
if (-not (Test-Path $repoTmpPath)) {
    Write-Host "Failed to clone the repository." -ForegroundColor Red
    exit
}

# Remove all files in the target folder (except the script itself and the 'repotmp' folder)
Write-Host "Removing all files in the target folder (except this script and 'repotmp')..." -ForegroundColor Yellow
Get-ChildItem $targetFolder -Recurse |
    Where-Object {
        $_.FullName -ne $MyInvocation.MyCommand.Definition -and
        $_.FullName -notlike "$repoTmpPath*"
    } | Remove-Item -Recurse -Force

# Copy all files from the 'repotmp' folder to the target folder
Write-Host "Copying files from 'repotmp' to the target folder..." -ForegroundColor Green
Copy-Item -Recurse -Force "$repoTmpPath\*" "$targetFolder\"

# Clean up by removing the 'repotmp' folder after copying is complete
Write-Host "Removing 'repotmp' folder..." -ForegroundColor Yellow
Remove-Item -Recurse -Force $repoTmpPath

Write-Host "Process completed successfully!" -ForegroundColor Cyan
