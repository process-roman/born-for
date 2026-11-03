# Builds the app icon set from assets/images/Born for logo final.png (Windows PowerShell 5.1).
# Run: powershell -File scripts/make-app-icons.ps1
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class LogoTools {
  // The moon and star, lifted off the dark sky by brightness: colour kept, alpha from luminance.
  public static Bitmap Symbol(Bitmap src, bool white, out Rectangle bounds) {
    int w = src.Width, h = src.Height;
    var outBmp = new Bitmap(w, h, PixelFormat.Format32bppArgb);
    var a = src.LockBits(new Rectangle(0, 0, w, h), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
    var b = outBmp.LockBits(new Rectangle(0, 0, w, h), ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
    var px = new byte[w * h * 4];
    Marshal.Copy(a.Scan0, px, 0, px.Length);
    int minX = w, minY = h, maxX = 0, maxY = 0;
    for (int i = 0; i < w * h; i++) {
      byte bl = px[i * 4], g = px[i * 4 + 1], r = px[i * 4 + 2], al = px[i * 4 + 3];
      double lum = 0.3 * r + 0.59 * g + 0.11 * bl;
      int x0 = i % w, y0 = i / w;
      // The tile's lighter purple rim is not part of the symbol.
      bool rim = x0 < 140 || y0 < 140 || x0 >= w - 140 || y0 >= h - 140;
      // The silhouette uses a lower cut so the purple underside of the moon stays solid.
      double cut = white ? 56 : 62, soft = white ? 24 : 40;
      int alpha = al == 0 || rim ? 0 : Math.Max(0, Math.Min(255, (int)((lum - cut) * 255 / soft)));
      if (white) { px[i * 4] = 255; px[i * 4 + 1] = 255; px[i * 4 + 2] = 255; }
      px[i * 4 + 3] = (byte)alpha;
      if (alpha > 60) { int x = i % w, y = i / w; minX = Math.Min(minX, x); maxX = Math.Max(maxX, x); minY = Math.Min(minY, y); maxY = Math.Max(maxY, y); }
    }
    Marshal.Copy(px, 0, b.Scan0, px.Length);
    src.UnlockBits(a); outBmp.UnlockBits(b);
    bounds = new Rectangle(minX, minY, maxX - minX + 1, maxY - minY + 1);
    return outBmp;
  }

  public static int Opaque(Bitmap bmp) {
    int n = 0;
    for (int y = 0; y < bmp.Height; y += 4) for (int x = 0; x < bmp.Width; x += 4) if (bmp.GetPixel(x, y).A > 128) n++;
    return n;
  }
}
"@
$ErrorActionPreference = 'Stop'
$root = 'C:\Users\romab\OneDrive\Desktop\Born For app\assets\images'
$src = [System.Drawing.Bitmap]::FromFile("$root\Born for logo final.png")
$n = $src.Width
$bg = [System.Drawing.Color]::FromArgb(255, 0x29, 0x0F, 0x5D) # the tile's own sky, sampled earlier

function New-Canvas([int]$size, [System.Drawing.Color]$fill) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $g.Clear($fill)
  return @($bmp, $g)
}
function Save-Png($c, [string]$path) { $c[1].Dispose(); $c[0].Save($path, [System.Drawing.Imaging.ImageFormat]::Png); $c[0].Dispose() }

# iOS and the general icon: crop inside the tile so its rounded edge never shows; iOS rounds it.
$inset = 90
$c = New-Canvas 1024 $bg
$c[1].DrawImage($src, (New-Object System.Drawing.Rectangle 0, 0, 1024, 1024), (New-Object System.Drawing.Rectangle $inset, $inset, ($n - 2 * $inset), ($n - 2 * $inset)), [System.Drawing.GraphicsUnit]::Pixel)
Save-Png $c "$root\icon.png"

# Android: the moon and star alone, centred in the safe zone, over a plain background colour.
function Save-Symbol([bool]$white, [string]$path) {
  $bounds = [System.Drawing.Rectangle]::Empty
  $sym = [LogoTools]::Symbol($src, $white, [ref]$bounds)
  $size = 1024
  $target = 0.5 * $size # the symbol's taller side, so it sits well inside every launcher shape
  $scale = $target / [Math]::Max($bounds.Width, $bounds.Height)
  $w = $bounds.Width * $scale; $h = $bounds.Height * $scale
  $c = New-Canvas $size ([System.Drawing.Color]::Transparent)
  $dest = New-Object System.Drawing.RectangleF (($size - $w) / 2), (($size - $h) / 2), $w, $h
  $c[1].DrawImage($sym, $dest, (New-Object System.Drawing.RectangleF $bounds.X, $bounds.Y, $bounds.Width, $bounds.Height), [System.Drawing.GraphicsUnit]::Pixel)
  $sym.Dispose()
  Save-Png $c $path
  "$path bounds $($bounds.Width)x$($bounds.Height)"
}
Save-Symbol $false "$root\android-icon-foreground.png"
Save-Symbol $true "$root\android-icon-monochrome.png"

# Splash, favicon and the in-app mark keep the rounded tile with transparent corners.
foreach ($pair in @(@(512, 'splash-icon.png'), @(64, 'favicon.png'), @(256, 'logo.png'))) {
  $c = New-Canvas $pair[0] ([System.Drawing.Color]::Transparent)
  $c[1].DrawImage($src, 0, 0, $pair[0], $pair[0])
  Save-Png $c "$root\$($pair[1])"
}

$mono = [System.Drawing.Bitmap]::FromFile("$root\android-icon-monochrome.png")
"monochrome opaque samples: $([LogoTools]::Opaque($mono)) of $((1024 / 4) * (1024 / 4))"
$mono.Dispose(); $src.Dispose()
'done'
