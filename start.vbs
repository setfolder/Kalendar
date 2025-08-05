Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd.exe /C node server.js", 0, False
WScript.Sleep 200 ' Wait before the browser opening
WshShell.Run "http://localhost:3000/#prog", 1, False