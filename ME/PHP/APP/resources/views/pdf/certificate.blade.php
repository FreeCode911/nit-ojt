<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $certificate['number'] }}</title>
    <style>
        @page { size: A4 landscape; margin: 0; }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body { font-family: 'DejaVu Sans', sans-serif; color: #27304a; }

        .sheet { position: relative; width: 842pt; height: 594pt; background-color: #ffffff; }

        .frame-outer { position: absolute; top: 14pt; left: 14pt; bottom: 14pt; right: 14pt; border: 2pt solid #312e81; }
        .frame-inner { position: absolute; top: 22pt; left: 22pt; bottom: 22pt; right: 22pt; border: 0.8pt solid #a5b4fc; }

        .brand { position: absolute; top: 46pt; left: 0; right: 0; text-align: center; }
        .brand .logo { font-size: 13pt; font-weight: bold; letter-spacing: 5pt; color: #4338ca; }
        .brand .tagline { margin-top: 5pt; font-size: 7.5pt; letter-spacing: 2.5pt; color: #6b7280; }

        .title {
            position: absolute; top: 116pt; left: 0; right: 0; text-align: center;
            font-family: 'DejaVu Serif', serif; font-size: 20pt; letter-spacing: 5pt; color: #111827;
        }

        .presented {
            position: absolute; top: 170pt; left: 0; right: 0; text-align: center;
            font-size: 10.5pt; font-style: italic; color: #9ca3af;
        }

        .intern-name {
            position: absolute; top: 194pt; left: 0; right: 0; text-align: center;
            font-family: 'DejaVu Serif', serif; font-size: 27pt; font-weight: bold;
            letter-spacing: 2pt; color: #1e1b4b; text-transform: uppercase;
        }

        .flourish { position: absolute; top: 252pt; left: 376pt; width: 90pt; border-top: 1.6pt solid #6366f1; }
        .flourish-diamond { position: absolute; top: 243pt; left: 0; right: 0; text-align: center; font-size: 9pt; color: #6366f1; }

        .role { position: absolute; top: 282pt; left: 0; right: 0; text-align: center; font-size: 11.5pt; line-height: 1.9; color: #374151; }
        .role b { color: #1e1b4b; }

        .meta {
            position: absolute; top: 350pt; left: 0; right: 0; text-align: center;
            font-size: 9.5pt; letter-spacing: 0.5pt; color: #6b7280; line-height: 1.8;
        }

        .seal { position: absolute; top: 430pt; left: 375pt; width: 92pt; height: 92pt; }
        .seal .outer {
            width: 92pt; height: 92pt; border: 2.5pt solid #4338ca;
            border-radius: 46pt; background-color: #eef2ff;
        }
        .seal .inner { position: absolute; top: 7pt; left: 7pt; width: 78pt; height: 78pt; border: 1pt solid #6366f1; border-radius: 39pt; text-align: center; }
        .seal .star { margin-top: 13pt; font-size: 15pt; color: #4338ca; }
        .seal .word { margin-top: 2pt; font-size: 6.5pt; font-weight: bold; letter-spacing: 1.5pt; color: #4338ca; }
        .seal .year { margin-top: 2pt; font-size: 10pt; font-weight: bold; color: #312e81; }

        .columns { position: absolute; top: 468pt; left: 96pt; right: 96pt; }
        .columns table { width: 100%; border-collapse: collapse; }
        .columns td { vertical-align: top; }
        .columns td.gap { width: 210pt; }
        .col-block { text-align: center; }
        .col-value { line-height: 16pt; font-size: 11.5pt; font-weight: bold; color: #111827; }
        .col-value.signature { font-family: 'DejaVu Serif', serif; font-style: italic; font-size: 13pt; }
        .col-rule { width: 170pt; margin: 30pt auto 0; border-bottom: 1pt solid #94a3b8; }
        .col-label { padding-top: 4pt; font-size: 7.5pt; font-weight: bold; letter-spacing: 2pt; color: #9ca3af; }
        .col-extra { padding-top: 4pt; font-size: 8.5pt; color: #6b7280; }

        .cert-no { position: absolute; bottom: 24pt; left: 0; right: 0; text-align: center; }
        .cert-no span {
            display: inline-block; border: 0.8pt solid #cbd5e1; border-radius: 11pt;
            padding: 5pt 16pt; font-size: 8.5pt; letter-spacing: 1pt; color: #475569;
        }
        .cert-no b { color: #312e81; }
    </style>
</head>
<body>
<div class="sheet">
    <div class="frame-outer"></div>
    <div class="frame-inner"></div>

    <div class="brand">
        <div class="logo">{{ strtoupper($app_name) }}</div>
        <div class="tagline">ON-THE-JOB TRAINING MANAGEMENT SYSTEM</div>
    </div>

    <div class="title">CERTIFICATE OF COMPLETION</div>

    <div class="presented">This certificate is proudly presented to</div>
    <div class="intern-name">{{ $certificate['issued_to'] }}</div>
    <div class="flourish-diamond">&#9670;</div>
    <div class="flourish"></div>

    <div class="role">
        for successfully completing the on-the-job training program<br>
        as <b>{{ $internship['position'] ?: 'Intern' }}</b>
        @if ($internship['department'])
            @if ($internship['company'])at <b>{{ $internship['company'] }}</b>@endif
            — {{ $internship['department'] }}
        @elseif ($internship['company'])
            at <b>{{ $internship['company'] }}</b>
        @endif
    </div>

    <div class="meta">
        Program period: {{ $internship['period'] }}<br>
        Approved hours: {{ $internship['approved_hours'] }} / {{ $internship['required_hours'] }} required
        ({{ $internship['progress_percent'] }}% complete)
    </div>

    <div class="seal">
        <div class="outer"></div>
        <div class="inner">
            <div class="star">&#9733;</div>
            <div class="word">CERTIFIED</div>
            <div class="year">{{ now()->format('Y') }}</div>
        </div>
    </div>

    <div class="columns">
        <table>
            <tr>
                <td class="col-block">
                    <div class="col-value">{{ $certificate['issued_date'] }}</div>
                    <div class="col-rule"></div>
                    <div class="col-label">DATE OF AWARD</div>
                </td>
                <td class="gap"></td>
                <td class="col-block">
                    <div class="col-value signature">{{ $certificate['issued_by'] ?: $internship['supervisor_name'] }}</div>
                    <div class="col-rule"></div>
                    <div class="col-label">PROGRAM SUPERVISOR</div>
                    <div class="col-extra">{{ $internship['company'] }}@if ($internship['department']) · {{ $internship['department'] }}@endif</div>
                </td>
            </tr>
        </table>
    </div>

    <div class="cert-no">
        <span>CERTIFICATE NO. <b>{{ $certificate['number'] }}</b></span>
    </div>
</div>
</body>
</html>
