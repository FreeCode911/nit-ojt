@echo off
rem Double-click this after you add, rename or change files in ME.
rem It rebuilds snippets.js so the website shows them.
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0update-snippets.ps1"
pause
