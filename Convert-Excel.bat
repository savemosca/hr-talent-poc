@echo off
setlocal
where py >nul 2>nul
if %errorlevel%==0 (
  py -3 "%~dp0scripts\excel_to_csv.py" %*
) else (
  where python >nul 2>nul
  if errorlevel 1 (
    echo Python 3 is required. Install it from python.org, then try again.
    echo.
    pause
    exit /b 1
  ) else (
    python "%~dp0scripts\excel_to_csv.py" %*
  )
)
set "conversion_exit=%errorlevel%"
echo.
pause
exit /b %conversion_exit%
