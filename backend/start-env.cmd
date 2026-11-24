@echo off
chcp 65001 >nul
rem ============================================================
rem  启动本地点餐系统依赖环境：Redis(6379) + MySQL(3307)
rem  依赖的运行时位置：
rem     D:\toolchain\redis\redis-server.exe
rem     D:\toolchain\mysql-data-3307\   (MySQL 8.4 数据目录)
rem     D:\toolchain\mysql-3307.ini     (实例配置)
rem ============================================================
set "REDIS_DIR=D:\toolchain\redis"
set "MYSQL_HOME=D:\MySQL Server 8.4"
set "MYSQL_DATA=D:\toolchain\mysql-data-3307"
set "MYSQL_INI=D:\toolchain\mysql-3307.ini"

if not exist "%REDIS_DIR%\redis-server.exe" (
    echo [ERROR] 未找到 Redis：%REDIS_DIR%\redis-server.exe
    exit /b 1
)
if not exist "%MYSQL_HOME%\bin\mysqld.exe" (
    echo [ERROR] 未找到 MySQL 程序：%MYSQL_HOME%\bin\mysqld.exe
    exit /b 1
)
if not exist "%MYSQL_DATA%\mysql" (
    echo [ERROR] 未找到 MySQL 数据目录：%MYSQL_DATA%
    echo         重建实例：^"%MYSQL_HOME%\bin\mysqld.exe^" --defaults-file=^"%MYSQL_INI^%" --initialize-insecure --console
    exit /b 1
)

echo [1/2] 启动 Redis  -^> 127.0.0.1:6379
start "huamao-redis" /min "%REDIS_DIR%\redis-server.exe" --port 6379 --bind 127.0.0.1 --dir "%REDIS_DIR%" --save "" --appendonly no

echo [2/2] 启动 MySQL  -^> 127.0.0.1:3307
start "huamao-mysql" /min "%MYSQL_HOME%\bin\mysqld.exe" --defaults-file="%MYSQL_INI%" --console

echo.
echo 已启动，等待 6379 / 3307 就绪（约 5 秒）后可启动后端。
echo MySQL：root / 123456，库名 huasheng_maodou
