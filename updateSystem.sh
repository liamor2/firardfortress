# Define variables
$repoUrl = "https://github.com/liamor2/firardfortress.git"  # URL of the GitHub repository
$repoClonePath = "C:\path\to\cloned\repo"  # Path where the repo will be cloned/pulled
$targetFolder = "C:\path\to\local\folder"  # Path to the folder you want to replace

# Check if git is installed
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git is not installed. Please install Git to continue." -ForegroundColor Red
    exit
}

# Clone or pull the repository
if (Test-Path $repoClonePath) {
    Write-Host "Repository already cloned. Pulling latest changes..." -ForegroundColor Yellow
    Set-Location $repoClonePath
    git pull origin main
} else {
    Write-Host "Cloning repository..." -ForegroundColor Green
    git clone $repoUrl $repoClonePath
}

# Check if the repository was successfully pulled/cloned
if (-not (Test-Path $repoClonePath)) {
    Write-Host "Failed to clone or pull the repository." -ForegroundColor Red
    exit
}

# Remove all files in the target folder
Write-Host "Removing all files in the target folder: $targetFolder" -ForegroundColor Yellow
Remove-Item -Recurse -Force "$targetFolder\*"

# Copy all files from the cloned repository to the target folder
Write-Host "Copying files from the repository to the target folder..." -ForegroundColor Green
Copy-Item -Recurse -Force "$repoClonePath\*" "$targetFolder\"

Write-Host "Files successfully replaced with the latest version from the repository!" -ForegroundColor Cyan
