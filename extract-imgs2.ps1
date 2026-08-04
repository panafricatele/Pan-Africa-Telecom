param($file)
$content = Get-Content $file -Raw
$matches = [regex]::Matches($content, '<img[^>]+>')
foreach ($m in $matches) { Write-Output $m.Value }
