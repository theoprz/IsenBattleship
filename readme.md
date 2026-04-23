REM =========================

REM Désinstallation MSI

REM =========================

if defined GUID (

    echo [INFO] Desinstallation via GUID !GUID! >> "%LOGFILE%"

    msiexec /x !GUID! /qn /norestart >> "%LOGFILE%" 2>&1

) else (

    echo [WARN] GUID non trouve, tentative via MSI local >> "%LOGFILE%"

    if exist "D:\appli\statro\WFRM_ZBX_AGENT2\zabbix_agent2-7.0.0-windows-amd64-openssl.msi" (

        msiexec /x "D:\appli\statro\WFRM_ZBX_AGENT2\zabbix_agent2-7.0.0-windows-amd64-openssl.msi" /qn /norestart >> "%LOGFILE%" 2>&1

    ) else (

        echo [ERROR] MSI introuvable pour fallback >> "%LOGFILE%"

        goto ERREUR

    )

)

REM ====