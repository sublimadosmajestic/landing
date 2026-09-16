Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Auxiliar\.gemini\antigravity-ide\brain\d8d76cae-14d7-439b-926e-130f49e44cb5\.user_uploaded\media_1789598772004.jpg"
$destDir = "c:\Users\Auxiliar\OneDrive\Desktop\indisutex webs\Landing majestic"

$src = [System.Drawing.Bitmap]::FromFile($srcPath)

$boxes = @(
    @{ Name = "ig-post-1.jpg"; X = 0;   Y = 6;   W = 326; H = 388 },
    @{ Name = "ig-post-2.jpg"; X = 328; Y = 6;   W = 326; H = 388 },
    @{ Name = "ig-post-3.jpg"; X = 656; Y = 6;   W = 326; H = 388 },
    @{ Name = "ig-post-4.jpg"; X = 0;   Y = 397; W = 326; H = 390 },
    @{ Name = "ig-post-5.jpg"; X = 328; Y = 397; W = 326; H = 390 },
    @{ Name = "ig-post-6.jpg"; X = 656; Y = 397; W = 326; H = 390 }
)

foreach ($b in $boxes) {
    $rect = New-Object System.Drawing.Rectangle($b.X, $b.Y, $b.W, $b.H)
    $tile = New-Object System.Drawing.Bitmap($b.W, $b.H)
    $g = [System.Drawing.Graphics]::FromImage($tile)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $b.W, $b.H)
    $g.DrawImage($src, $destRect, $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    
    $outFile = Join-Path $destDir $b.Name
    $tile.Save($outFile, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $tile.Dispose()
    
    Write-Host "Extracted clean tile: $($b.Name) [X=$($b.X), Y=$($b.Y), W=$($b.W), H=$($b.H)]"
}

$src.Dispose()
Write-Host "All 6 clean tiles extracted successfully!"
