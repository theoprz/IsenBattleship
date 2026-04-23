$cmd = "msiexec /i `"$MsiSource`" /qn /norestart " +
       "INSTALLFOLDER=`"$InstallFolder`" " +
       "SERVER=$ZabbixServer " +
       "SERVERACTIVE=$ZabbixServerActive " +
       "HOSTNAME=$Hostname " +
       "HOSTMETADATA=Windows " +
       "/l*v `"$MsiLogFile`""

Write-Host "[INFO] CMD: $cmd"

cmd.exe /c $cmd

if ($LASTEXITCODE -ne 0) {
    throw "Erreur MSI code $LASTEXITCODE"
}