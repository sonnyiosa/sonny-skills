param([string] $Runtime)
$ErrorActionPreference = 'Stop'

function ReadHookFile([string] $name) {
    [System.IO.File]::ReadAllText((Join-Path $PSScriptRoot $name), [System.Text.Encoding]::UTF8)
}

# -ccontains, -ceq, and EndsWith(string) compare by culture, which skips
# zero-width characters, so compare sheet text ordinally.
function HasOrdinal([string[]] $list, [string] $item) {
    $null -ne $list -and [Array]::IndexOf($list, $item) -ge 0
}

switch -CaseSensitive ($Runtime) {
    'codex' {
        $sheetRoot = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $env:USERPROFILE '.codex' }
        $sheet = Join-Path $sheetRoot 'pstack-models.md'
        $context = 'session-start-context.md'
    }
    default {
        [Console]::Error.WriteLine("session-start.ps1: unknown runtime '$Runtime' (expected codex)")
        exit 2
    }
}

# A missing, unreadable, or undecodable sheet leaves $sheetLines null and the
# hook on, as session-start.sh does.
$sheetLines = $null
if (Test-Path -LiteralPath $sheet -PathType Leaf) {
    try {
        $bytes = [System.IO.File]::ReadAllBytes($sheet)
        # Windows PowerShell 5.1's `>` writes UTF-16 LE with a byte-order mark.
        # The decoder throws where iconv in read-sheet.sh fails: on an odd byte
        # count or an unpaired surrogate.
        $encoding = if ($bytes.Length -ge 2 -and $bytes[0] -eq 0xFF -and $bytes[1] -eq 0xFE) { [System.Text.UnicodeEncoding]::new($false, $false, $true) } else { [System.Text.UTF8Encoding]::new($false) }
        $sheetLines = ($encoding.GetString($bytes) -replace '^\uFEFF', '') -split "`n" | ForEach-Object { $_ -replace "`r$", '' }
    } catch { }
}
if ('off'.Equals($env:PSTACK_SESSION_HOOK, [System.StringComparison]::Ordinal) -or (HasOrdinal $sheetLines 'session hook: off')) {
    exit 0
}

$output = ReadHookFile $context
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
[Console]::Write($output)
