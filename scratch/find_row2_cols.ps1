Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile('C:\Users\Auxiliar\.gemini\antigravity-ide\brain\d8d76cae-14d7-439b-926e-130f49e44cb5\.user_uploaded\media_1789598772004.jpg')

Write-Host "--- Scanning X at y=600 (Row 2) from x=320 to 335 ---"
for ($x = 320; $x -le 335; $x++) {
    $c = $img.GetPixel($x, 600)
    Write-Host "x=$x | R=$($c.R), G=$($c.G), B=$($c.B)"
}

Write-Host "--- Scanning X at y=600 (Row 2) from x=650 to 665 ---"
for ($x = 650; $x -le 665; $x++) {
    $c = $img.GetPixel($x, 600)
    Write-Host "x=$x | R=$($c.R), G=$($c.G), B=$($c.B)"
}

$img.Dispose()
