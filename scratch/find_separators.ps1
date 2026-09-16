Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile('C:\Users\Auxiliar\.gemini\antigravity-ide\brain\d8d76cae-14d7-439b-926e-130f49e44cb5\.user_uploaded\media_1789598772004.jpg')

Write-Host "Image size: $($img.Width) x $($img.Height)"

# Find black bar at top
for ($y = 0; $y -lt 30; $y++) {
    $c = $img.GetPixel(300, $y)
    Write-Host "Top y=$y : R=$($c.R), G=$($c.G), B=$($c.B)"
}

# Find white separator around y=385-405
for ($y = 385; $y -lt 405; $y++) {
    $c = $img.GetPixel(300, $y)
    Write-Host "Middle y=$y : R=$($c.R), G=$($c.G), B=$($c.B)"
}

# Find vertical separator around x=320-335
for ($x = 320; $x -lt 336; $x++) {
    $c = $img.GetPixel($x, 200)
    Write-Host "Col1-2 x=$x : R=$($c.R), G=$($c.G), B=$($c.B)"
}

# Find vertical separator around x=645-665
for ($x = 645; $x -lt 665; $x++) {
    $c = $img.GetPixel($x, 200)
    Write-Host "Col2-3 x=$x : R=$($c.R), G=$($c.G), B=$($c.B)"
}

$img.Dispose()
