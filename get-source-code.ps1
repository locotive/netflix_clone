# 결과를 저장할 파일 생성
$outputFile = "source_code_review.txt"

# 파일 헤더 작성
"# Project Source Code Review" | Out-File $outputFile

# 파일 구조 추가
"## Project Structure" | Out-File $outputFile -Append
Get-ChildItem -Recurse | Select-Object FullName | Out-File $outputFile -Append

"## Source Code" | Out-File $outputFile -Append

# Vue, JavaScript, TypeScript 파일 찾아서 내용 추가
Get-ChildItem -Recurse -Include *.vue,*.js,*.ts | ForEach-Object {
    "`n### File: $($_.FullName)`n" | Out-File $outputFile -Append
    "``````$($_.Extension.TrimStart('.'))" | Out-File $outputFile -Append
    Get-Content $_.FullName | Out-File $outputFile -Append
    "``````" | Out-File $outputFile -Append
} 