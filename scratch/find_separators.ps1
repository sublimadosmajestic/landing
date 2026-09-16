Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile('C:\Users\Auxiliar\.gemini\antigravity-ide\brain\d8d76cae-14d7-439b-926e-130f49e44cb5\.user_uploaded\media_1789598772004.jpg')

Write-Host "--- Scanning row separator at x=100, 500, 800 ---"
for ($y = 385; $y -le 405; $y++) {
    $c1 = $img.GetPixel(100, $y)
    $c2 = $img.GetPixel(500, $y)
    $c3 = $img.GetPixel(800, $y)
    Write-Host "y=$y | x100=($($c1.R),$($c1.G),$($c1.B)) | x500=($($c2.R),$($c2.G),$($c2.B)) | x800=($($c3.R),$($c3.G),$($c3.B))"
}

# Also check bottom boundary
Write-Host "--- Scanning bottom boundary at y=780-791 ---"
for ($y = 780; $y -lt $img.Height; $y++) {
    $c1 = $img.GetPixel(100, $y)
    Write-Host "y=$y | x100=($($c1.R),$($c1.G),$($c1.B))"
}

$img.Dispose()
