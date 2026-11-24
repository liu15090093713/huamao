@echo off
rem ?????????Redis(6379) ? ?? MySQL(3307)??? sky-take-out ?????
set "SHARED=C:\Users\21452\Desktop\sky-take-out\.runtime"

if not exist "%SHARED%\redis\redis-server.exe" (
    echo [ERROR] ??? Redis ???: %SHARED%\redis
    exit /b 1
)

echo [1/2] ?? Redis (127.0.0.1:6379) ...
start "sky-redis" /min "%SHARED%\redis\redis-server.exe" "%SHARED%\redis\redis.takeout.conf"

if not exist "%SHARED%\mysql-data\mysql" (
    echo [ERROR] ??? MySQL ????
    exit /b 1
)

echo [2/2] ?? MySQL (127.0.0.1:3307) ...
start "sky-mysql" /min "D:\MySQL Server 8.4\bin\mysqld.exe" --defaults-file="%SHARED%\mysql-data\my.ini"

echo ??????????????? 6379 / 3307 ????
