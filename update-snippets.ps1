# update-snippets.ps1 - rebuild snippets.js from the files in the ME folder
# Run this after you add / rename / change files in ME.
$src  = "$PSScriptRoot\ME"
$out  = "$PSScriptRoot\snippets.js"
$exts = @('.html', '.htm', '.css', '.js', '.php', '.json', '.xml', '.txt', '.md')
$skip = @('snippets.js')

# all matching files, index.html always first
$files = Get-ChildItem $src -File |
         Where-Object { $exts -contains $_.Extension -and $skip -notcontains $_.Name } |
         Sort-Object Name
$names = @()
if ($files.Name -contains 'index.html') { $names += 'index.html' }
$names += ($files.Name | Where-Object { $_ -ne 'index.html' } | Sort-Object)

# build "const FILES = { "name": "code", ... }" by hand (ConvertTo-Json breaks strings)
$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine("// Code of every file in the ME folder (auto generated)")
[void]$sb.Append("const FILES = {")
$first = $true
foreach ($n in $names) {
    $text = Get-Content (Join-Path $src $n) -Raw -Encoding UTF8
    $e = $text.Replace('\', '\\').Replace('"', '\"').Replace("`r", '\r').Replace("`n", '\n').Replace("`t", '\t')
    if (-not $first) { [void]$sb.Append(",") }
    $first = $false
    [void]$sb.Append("`n  `"$n`": `"$e`"")
}
[void]$sb.Append("`n};")

[System.IO.File]::WriteAllText($out, $sb.ToString(), (New-Object System.Text.UTF8Encoding($false)))
Write-Output "snippets.js updated with $($names.Count) files:"
$names | ForEach-Object { Write-Output "  - $_" }
