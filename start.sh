#!/bin/bash
nohup node server.js > server.log 2>&1 &
sleep 0.2
xdg-open "http://localhost:3000/#prog" 2>/dev/null || open "http://localhost:3000/#prog"
