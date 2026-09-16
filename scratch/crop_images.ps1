Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Auxiliar\.gemini\antigravity-ide\brain\d8d76cae-14d7-439b-926e-130f49e44cb5\.user_uploaded\media_1789598772004.jpg"
$destDir = "c:\Users\Auxiliar\OneDrive\Desktop\indisutex webs\Landing majestic"

$src = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Host "Original Image Dimensions: $($src.Width) x $($src.Height)"

# The image has 3 columns and 2 rows
$cols = 3
$rows = 2

$colWidth = [int]($src.Width / $cols)
$rowHeight = [int]($src.Height / $rows)

Write-Host "Tile Size: $colWidth x $rowHeight"

$postNames = @(
    "ig-post-1.jpg",
    "ig-post-2.jpg",
    "ig-post-3.jpg",
    "ig-post-4.jpg",
    "ig-post-5.jpg",
    "ig-post-6.jpg"
)

$index = 0
for ($r = 0; $r -lt $rows; $r++) {
    for ($c = 0; $c -lt $cols; $c++) {
        $x = $c * $colWidth
        $y = $r * $rowHeight
        $rect = New-Object System.Drawing.Rectangle($x, $y, $colWidth, $rowHeight)
        
        $tile = New-Object System.Drawing.Bitmap($colWidth, $rowHeight)
        $g = [System.Drawing.Graphics]::FromImage($tile)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        
        $destRect = New-Object System.Drawing.Rectangle(0, 0, $colWidth, $rowHeight)
        $g.DrawImage($src, $destRect, $rect, [System.Drawing.GraphicsUnit]::Pixel)
        $g.Dispose()
        
        $outFile = Join-Path $destDir $postNames[$index]
        $tile.Save($outFile, [System.Drawing.Imaging.ImageFormat]::Jpeg)
        $tile.Dispose()
        
        Write-Host "Saved: $($postNames[$index]) at ($x, $y)"
        $index++
    }
}

$src.Dispose()
Write-Host "All 6 tiles saved successfully!"
