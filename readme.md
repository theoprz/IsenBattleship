@echo off
setlocal EnableExtensions

SET PACKAGENAME=WFRM_ZBX_AGENT2
SET PACKAGEVERSION=7.0
SET LOGDIR=C:\tools\logs
SET LOGFILE=%LOGDIR%\%PACKAGENAME%_%PACKAGEVERSION%_setup_uninstall.log

if not exist "%LOGDIR%" mkdir "%LOGDIR%" >nul 2>&1

echo Desinstallation paquet %PACKAGENAME%_%PACKAGEVERSION% > "%LOGFILE%"
echo Debut %DATE% %TIME% >> "%LOGFILE%"
echo. >> "%LOGFILE%"

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ^
"$ErrorActionPreference='Stop';" ^
"$svc=Get-Service -Name 'Zabbix Agent 2' -ErrorAction SilentlyContinue;" ^
"if($svc){ if($svc.Status -eq 'Running'){ Stop-Service -Name 'Zabbix Agent 2' -Force } };" ^
"$keys=@(" ^
"'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*'," ^
"'HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*'" ^
");" ^
"$app=Get-ItemProperty $keys -ErrorAction SilentlyContinue | Where-Object { $_.DisplayName -like 'Zabbix Agent 2*' } | Select-Object -First 1;" ^
"if($app -and $app.UninstallString){" ^
"  $u=$app.UninstallString;" ^
"  if($u -match '\{[A-Z0-9\-]+\}'){ $guid=$matches[0]; Start-Process msiexec.exe -ArgumentList '/x', $guid, '/qn', '/norestart' -Wait }" ^
"  else { Start-Process cmd.exe -ArgumentList '/c', $u + ' /qn /norestart' -Wait }" ^
"} else {" ^
"  $msi='D:\appli\statro\WFRM_ZBX_AGENT2\zabbix_agent2-7.0.0-windows-amd64-openssl.msi';" ^
"  if(Test-Path $msi){ Start-Process msiexec.exe -ArgumentList '/x', $msi, '/qn', '/norestart' -Wait }" ^
"};" ^
"if(Test-Path 'D:\appli\statro\WFRM_ZBX_AGENT2'){ Remove-Item 'D:\appli\statro\WFRM_ZBX_AGENT2' -Recurse -Force -ErrorAction SilentlyContinue }" >> "%LOGFILE%" 2>&1

if errorlevel 1 goto :ERREUR

echo [INFO] Desinstallation de l'Agent V2 Zabbix : OK >> "%LOGFILE%"
goto :FIN

:ERREUR
echo [ERROR] Probleme de desinstallation de l'Agent V2 Zabbix >> "%LOGFILE%"
echo Heure %TIME% >> "%LOGFILE%"
echo Log disponible %LOGFILE% >> "%LOGFILE%"
exit /b 1

:FIN
echo Fin %DATE% %TIME% >> "%LOGFILE%"
endlocal
exit /b 0