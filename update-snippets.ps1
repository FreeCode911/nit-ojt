# update-snippets.ps1 - rebuild snippets.js from the files in the ME folder
# Run this after you add / rename / change files in ME.
$src  = "$PSScriptRoot\ME"
$out  = "$PSScriptRoot\snippets.js"
$exts = @('.html', '.htm', '.css', '.js', '.php', '.json', '.xml', '.txt', '.md')
$skip = @('snippets.js')

# every matching file, also the ones inside subfolders (ME\PHP\...)
# Composer packages (ME\PHP\vendor) are skipped - not part of the library
$files = Get-ChildItem $src -Recurse -File |
         Where-Object {
             $exts -contains $_.Extension -and
             $skip -notcontains $_.Name -and
             $_.FullName -notlike "*\vendor\*"
         }

# the key is the path relative to ME, using / : "PHP/hello.php"
$rel = $files | ForEach-Object { $_.FullName.Substring($src.Length + 1).Replace('\', '/') }

# index.html always first, the rest in alphabetical order
$names = @()
if ($rel -contains 'index.html') { $names += 'index.html' }
$names += ($rel | Where-Object { $_ -ne 'index.html' } | Sort-Object)

# build "const FILES = { "name": "code", ... }" by hand (ConvertTo-Json breaks strings)
$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine("// Code of every file in the ME folder (auto generated)")
[void]$sb.Append("const FILES = {")
$first = $true
foreach ($n in $names) {
    $text = Get-Content (Join-Path $src ($n.Replace('/', '\'))) -Raw -Encoding UTF8
    $e = $text.Replace('\', '\\').Replace('"', '\"').Replace("`r", '\r').Replace("`n", '\n').Replace("`t", '\t')
    if (-not $first) { [void]$sb.Append(",") }
    $first = $false
    [void]$sb.Append("`n  `"$n`": `"$e`"")
}
[void]$sb.Append("`n};")

[System.IO.File]::WriteAllText($out, $sb.ToString(), (New-Object System.Text.UTF8Encoding($false)))
Write-Output "snippets.js updated with $($names.Count) files:"
$names | ForEach-Object { Write-Output "  - $_" }
