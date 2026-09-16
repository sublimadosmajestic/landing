Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Auxiliar\.gemini\antigravity-ide\brain\d8d76cae-14d7-439b-926e-130f49e44cb5\.user_uploaded\media_1789598772004.jpg"
$destDir = "c:\Users\Auxiliar\OneDrive\Desktop\indisutex webs\Landing majestic"

$bytes = [System.IO.File]::ReadAllBytes($srcPath)
$ms = New-Object System.IO.MemoryStream($bytes, $false)
$src = [System.Drawing.Bitmap]::FromStream($ms)

$boxes = @(
    @{ Name = "ig-post-1.jpg"; X = 0;   Y = 12;  W = 328; H = 402 },
    @{ Name = "ig-post-2.jpg"; X = 330; Y = 12;  W = 322; H = 402 },
    @{ Name = "ig-post-3.jpg"; X = 654; Y = 12;  W = 328; H = 402 },
    @{ Name = "ig-post-4.jpg"; X = 0;   Y = 421; W = 341; H = 368 },
    @{ Name = "ig-post-5.jpg"; X = 343; Y = 421; W = 310; H = 368 },
    @{ Name = "ig-post-6.jpg"; X = 654; Y = 421; W = 328; H = 368 }
)

foreach ($b in $boxes) {
    $outFile = Join-Path $destDir $b.Name
    if (Test-Path $outFile) {
        Remove-Item $outFile -Force -ErrorAction SilentlyContinue
    }

    $rect = New-Object System.Drawing.Rectangle($b.X, $b.Y, $b.W, $b.H)
    $tile = New-Object System.Drawing.Bitmap($b.W, $b.H)
    $g = [System.Drawing.Graphics]::FromImage($tile)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $b.W, $b.H)
    $g.DrawImage($src, $destRect, $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    
    $tile.Save($outFile, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $tile.Dispose()
    
    Write-Host "Successfully saved: $($b.Name)"
}

$src.Dispose()
$ms.Dispose()
Write-Host "All 6 perfect tiles saved!"
