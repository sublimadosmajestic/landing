Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile('C:\Users\Auxiliar\.gemini\antigravity-ide\brain\d8d76cae-14d7-439b-926e-130f49e44cb5\.user_uploaded\media_1789598772004.jpg')

Write-Host "--- Scanning Y from 390 to 440 at x=50 (left column) ---"
for ($y = 390; $y -le 430; $y++) {
    $c = $img.GetPixel(50, $y)
    Write-Host "y=$y | R=$($c.R), G=$($c.G), B=$($c.B)"
}

Write-Host "--- Scanning Y from 390 to 440 at x=500 (center column) ---"
for ($y = 390; $y -le 430; $y++) {
    $c = $img.GetPixel(500, $y)
    Write-Host "y=$y | R=$($c.R), G=$($c.G), B=$($c.B)"
}

$img.Dispose()
