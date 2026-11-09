$baseDir = "c:\Users\USER\sonora-music-system"

$files = Get-ChildItem -Path $baseDir -Recurse -Include "*.tsx","*.ts","*.css" |
  Where-Object { $_.FullName -notmatch "node_modules|\.next|\.git|sonora\.json|sonora\.backup|package-lock|tailwind\.config" }

$total = $files.Count
Write-Host "Found $total files to process."

$changed = 0

foreach ($file in $files) {
  $lines = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)

  $newContent = $lines `
    -replace 'emerald-50\b', 'blue-50' `
    -replace 'emerald-100\b', 'blue-100' `
    -replace 'emerald-200\b', 'blue-200' `
    -replace 'emerald-300\b', 'blue-300' `
    -replace 'emerald-400\b', 'blue-400' `
    -replace 'emerald-500\b', 'blue-500' `
    -replace 'emerald-600\b', 'blue-600' `
    -replace 'emerald-700\b', 'blue-700' `
    -replace 'emerald-800\b', 'blue-800' `
    -replace 'emerald-900\b', 'blue-900' `
    -replace 'emerald-950\b', 'blue-950' `
    -replace 'teal-400\b', 'blue-400' `
    -replace 'teal-500\b', 'blue-500' `
    -replace 'teal-600\b', 'blue-600' `
    -replace 'teal-700\b', 'blue-700' `
    -replace 'teal-800\b', 'blue-800' `
    -replace 'teal-900\b', 'blue-900' `
    -replace 'teal-950\b', 'blue-950' `
    -replace '#10B981', '#2563EB' `
    -replace '#10b981', '#2563eb' `
    -replace '#059669', '#1d4ed8' `
    -replace '#047857', '#1e40af' `
    -replace '#065f46', '#1e3a8a' `
    -replace '#064e3b', '#172554' `
    -replace '#00E599', '#60A5FA' `
    -replace '#00e599', '#60a5fa' `
    -replace 'rgba\(16, 185, 129', 'rgba(37, 99, 235' `
    -replace 'rgba\(5, 150, 105', 'rgba(29, 78, 216' `
    -replace 'rgba\(4, 120, 87', 'rgba(30, 64, 175' `
    -replace 'rgba\(0, 229, 153', 'rgba(96, 165, 250'

  if ($newContent -ne $lines) {
    [System.IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.Encoding]::UTF8)
    $changed++
    Write-Host "Updated: $($file.Name)"
  }
}

Write-Host ""
Write-Host "Done. Updated $changed / $total files."
