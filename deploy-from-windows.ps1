# ALRA Eco Village - Deploy from Windows
# This script helps deploy the application from Windows to Ubuntu server

$SERVER_IP = "89.104.74.76"
$SERVER_USER = "root"
$SERVER_PASSWORD = "yvaAaDiBKCQ8ybN4"
$LOCAL_PATH = "c:\Users\alkaw\OneDrive\Desktop\Alra"
$REMOTE_PATH = "/root/alra"

Write-Host "=========================================="
Write-Host "ALRA Eco Village - Deploy from Windows"
Write-Host "=========================================="
Write-Host ""

# Check if PSCP (PuTTY) is available
$pscpPath = "pscp.exe"
$plinkPath = "plink.exe"

if (-not (Get-Command $pscpPath -ErrorAction SilentlyContinue)) {
    Write-Host "Error: PSCP not found. Please install PuTTY tools from:"
    Write-Host "https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html"
    Write-Host ""
    Write-Host "Alternative: Use WinSCP or FileZilla to manually upload files"
    Write-Host "Server: $SERVER_IP"
    Write-Host "Username: $SERVER_USER"
    Write-Host "Password: $SERVER_PASSWORD"
    exit 1
}

Write-Host "Step 1: Creating archive..."
$archivePath = "$LOCAL_PATH\alra-deploy.zip"

# Remove old archive if exists
if (Test-Path $archivePath) {
    Remove-Item $archivePath
}

# Create archive excluding node_modules
$excludeDirs = @("node_modules", ".git", "logs", "uploads")
Get-ChildItem -Path $LOCAL_PATH -Exclude $excludeDirs | 
    Compress-Archive -DestinationPath $archivePath -Update

Write-Host "Archive created: $archivePath"
Write-Host ""

Write-Host "Step 2: Uploading to server..."
Write-Host "This may take a few minutes..."
Write-Host ""

# Upload using PSCP
& $pscpPath -pw $SERVER_PASSWORD $archivePath "${SERVER_USER}@${SERVER_IP}:${REMOTE_PATH}.zip"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Upload successful!"
    Write-Host ""
    
    Write-Host "Step 3: Extracting on server..."
    
    # Connect and extract using plink
    $commands = @"
cd /root
apt install -y unzip
rm -rf alra
mkdir -p alra
unzip -o alra-deploy.zip -d alra
cd alra
chmod +x *.sh
echo "Files extracted successfully!"
"@
    
    $commands | & $plinkPath -pw $SERVER_PASSWORD "${SERVER_USER}@${SERVER_IP}"
    
    Write-Host ""
    Write-Host "=========================================="
    Write-Host "Upload completed!"
    Write-Host "=========================================="
    Write-Host ""
    Write-Host "Next steps:"
    Write-Host "1. Connect to server: ssh $SERVER_USER@$SERVER_IP"
    Write-Host "2. Run setup: cd /root/alra && ./setup-server.sh"
    Write-Host "3. Configure MySQL and .env.production"
    Write-Host "4. Run deploy: ./deploy.sh"
    Write-Host ""
    Write-Host "Or connect with PuTTY to $SERVER_IP"
} else {
    Write-Host "Upload failed!"
    Write-Host ""
    Write-Host "Alternative options:"
    Write-Host "1. Use WinSCP (https://winscp.net/)"
    Write-Host "2. Use FileZilla (https://filezilla-project.org/)"
    Write-Host ""
    Write-Host "Connection details:"
    Write-Host "  Protocol: SFTP"
    Write-Host "  Host: $SERVER_IP"
    Write-Host "  Port: 22"
    Write-Host "  Username: $SERVER_USER"
    Write-Host "  Password: $SERVER_PASSWORD"
}
