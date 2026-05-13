<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>RPS - {{ $rps->mataKuliah->nama_mk }}</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 11px; line-height: 1.4; color: #333; margin: 0; padding: 0; }
        .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .header-table td { border: 1px solid #000; padding: 8px; vertical-align: middle; }
        .logo { width: 60px; }
        .title { text-align: center; font-weight: bold; font-size: 14px; }
        
        .section-title { background-color: #f0f0f0; font-weight: bold; padding: 5px; border: 1px solid #000; margin-top: 15px; text-transform: uppercase; }
        
        table.data-table { width: 100%; border-collapse: collapse; margin-top: 5px; }
        table.data-table th, table.data-table td { border: 1px solid #000; padding: 6px; text-align: left; vertical-align: top; }
        table.data-table th { background-color: #f9f9f9; text-align: center; }

        .tte-container { margin-top: 20px; width: 100%; }
        .tte-table { width: 100%; border-collapse: collapse; border: none; }
        .tte-table td { border: none; text-align: center; width: 33.3%; vertical-align: bottom; padding: 10px; }
        .tte-image { height: 70px; margin-bottom: 5px; border: 1px dashed #eee; }

        .chart-box { text-align: center; margin-top: 20px; page-break-inside: avoid; }
        .page-break { page-break-after: always; }
    </style>
</head>
<body>

    @php
        // Helper function untuk mendapatkan path fisik file di folder tenant
        $getTenantFile = function($path) {
            if (!$path) return null;
            $fullPath = storage_path('app/public/' . $path);
            return file_exists($fullPath) ? $fullPath : null;
        };
    @endphp

    <table class="header-table">
        <tr>
            <td width="15%" style="text-align: center;">
                <img src="{{ public_path('images/polman-logo.png') }}" class="logo">
            </td>
            <td width="55%" class="title">
                POLITEKNIK MANUFAKTUR BANDUNG<br>
                JURUSAN TEKNIK OTOMASI MANUFAKTUR DAN MEKATRONIKA<br>
                <span style="font-size: 12px;">PROGRAM STUDI {{ $rps->mataKuliah->prodi->nama_prodi ?? 'TEKNOLOGI REKAYASA INFORMATIKA INDUSTRI' }}</span>
            </td>
            <td width="30%" style="font-size: 10px;">
                Nomor Dokumen: <b>{{ $rps->kode_dokumen }}</b><br>
                Edisi/Revisi: 01/00<br>
                Tanggal Berlaku: {{ \Carbon\Carbon::parse($rps->tanggal_penyusunan)->format('d F Y') }}
            </td>
        </tr>
    </table>

    <div style="text-align: center; font-weight: bold; font-size: 13px; margin-bottom: 10px;">
        RENCANA PEMBELAJARAN SEMESTER (RPS)
    </div>

    <table class="data-table">
        <tr>
            <th width="20%">Mata Kuliah</th>
            <td width="30%">{{ $rps->mataKuliah->nama_mk }}</td>
            <th width="20%">Kode MK</th>
            <td width="30%">{{ $rps->mataKuliah->kode_mk }}</td>
        </tr>
        <tr>
            <th>Tahun Akademik</th>
            <td>{{ $rps->tahun_akademik }}</td>
            <th>SKS / Semester</th>
            <td>{{ $rps->mataKuliah->sks ?? '-' }} / {{ $rps->mataKuliah->semester ?? '-' }}</td>
        </tr>
        <tr>
            <th>Dosen Pengampu</th>
            <td colspan="3">
                @if($rps->dosenBiodata)
                    {{ $rps->dosenBiodata->gelar_depan }} {{ $rps->dosenBiodata->nama_lengkap }} {{ $rps->dosenBiodata->gelar_belakang }}
                @else
                    -
                @endif
            </td>
        </tr>
    </table>

    <div class="section-title">Otorisasi / Pengesahan</div>
    <table class="tte-table">
        <tr>
            <td>Dosen Pengampu</td>
            <td>Ketua Program Studi</td>
            <td>Ketua Jurusan</td>
        </tr>
        <tr>
            <td>
                @if($img = $getTenantFile($rps->tte_dosen))
                    <img src="{{ $img }}" class="tte-image"><br>
                @else
                    <div style="height: 70px;"></div>
                @endif
                (................................)
            </td>
            <td>
                @if($img = $getTenantFile($rps->tte_kaprodi))
                    <img src="{{ $img }}" class="tte-image"><br>
                @else
                    <div style="height: 70px;"></div>
                @endif
                (................................)
            </td>
            <td>
                @if($img = $getTenantFile($rps->tte_kajur))
                    <img src="{{ $img }}" class="tte-image"><br>
                @else
                    <div style="height: 70px;"></div>
                @endif
                (................................)
            </td>
        </tr>
    </table>

    <div class="section-title">Deskripsi Singkat Mata Kuliah</div>
    <div style="border: 1px solid #000; padding: 8px; min-height: 50px;">
        {{ $rps->mataKuliah->deskripsi ?? '-' }}
    </div>

    <div class="section-title">Bahan Kajian / Materi Pembelajaran</div>
    <div style="border: 1px solid #000; padding: 8px;">
        {!! nl2br(e($rps->bahan_kajian_utama)) !!}
    </div>

    <div class="page-break"></div>

    <div class="section-title">Sistem Evaluasi (Bobot Penilaian)</div>
    <table class="data-table" style="text-align: center;">
        <thead>
            <tr>
                <th>CPMK</th>
                <th>Quiz</th>
                <th>Tugas</th>
                <th>Project</th>
                <th>UTS</th>
                <th>UAS</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($rps->penilaians as $p)
            <tr>
                <td style="font-weight: bold;">{{ $p->cpmk->kode_cpmk ?? 'CPMK' }}</td>
                <td>{{ $p->quiz }}%</td>
                <td>{{ $p->tugas }}%</td>
                <td>{{ $p->project }}%</td>
                <td>{{ $p->uts }}%</td>
                <td>{{ $p->uas }}%</td>
                @php $total = $p->quiz + $p->tugas + $p->project + $p->uts + $p->uas; @endphp
                <td style="font-weight: bold;">{{ $total }}%</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="chart-box">
        @php
            $labels = $rps->penilaians->map(fn($p, $i) => $p->cpmk->kode_cpmk ?? 'C'.($i+1))->toArray();
            $datasets = [
                ['label' => 'Quiz', 'data' => $rps->penilaians->pluck('quiz')->map(fn($v) => (float)$v)->toArray(), 'borderColor' => '#3b82f6', 'backgroundColor' => 'rgba(59,130,246,0.1)'],
                ['label' => 'Tugas', 'data' => $rps->penilaians->pluck('tugas')->map(fn($v) => (float)$v)->toArray(), 'borderColor' => '#10b981', 'backgroundColor' => 'rgba(16,185,129,0.1)'],
                ['label' => 'Project', 'data' => $rps->penilaians->pluck('project')->map(fn($v) => (float)$v)->toArray(), 'borderColor' => '#f59e0b', 'backgroundColor' => 'rgba(245,158,11,0.1)'],
                ['label' => 'UTS', 'data' => $rps->penilaians->pluck('uts')->map(fn($v) => (float)$v)->toArray(), 'borderColor' => '#8b5cf6', 'backgroundColor' => 'rgba(139,92,246,0.1)'],
                ['label' => 'UAS', 'data' => $rps->penilaians->pluck('uas')->map(fn($v) => (float)$v)->toArray(), 'borderColor' => '#ef4444', 'backgroundColor' => 'rgba(239,68,68,0.1)'],
            ];

            $chartConfig = [
                'type' => 'radar',
                'data' => ['labels' => $labels, 'datasets' => $datasets],
                'options' => [
                    'scale' => ['ticks' => ['min' => 0, 'max' => 100, 'stepSize' => 20]],
                    'legend' => ['position' => 'bottom', 'labels' => ['fontSize' => 10]]
                ]
            ];
            $chartUrl = "https://quickchart.io/chart?w=450&h=280&c=" . urlencode(json_encode($chartConfig));
        @endphp
        <p style="font-weight: bold; margin-bottom: 5px;">Grafik Distribusi Penilaian</p>
        <img src="{{ $chartUrl }}" width="400">
    </div>

    <div class="page-break"></div>

    <div class="section-title">Rencana Pembelajaran Mingguan</div>
    <table class="data-table" style="font-size: 9px;">
        <thead>
            <tr>
                <th width="5%">Mgu Ke-</th>
                <th width="20%">Kemampuan Akhir / Indikator</th>
                <th width="20%">Bahan Kajian</th>
                <th width="20%">Metode / Estimasi Waktu</th>
                <th width="25%">Pengalaman Belajar</th>
                <th width="10%">Bobot (%)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($rps->details as $detail)
            <tr>
                <td style="text-align: center;">{{ $detail->pertemuan_ke }}</td>
                <td>
                    <b>Kemampuan:</b> {{ $detail->kemampuan_akhir }}<br><br>
                    <b>Indikator:</b> {{ $detail->indikator }}
                </td>
                <td>{{ $detail->bahan_kajian }}</td>
                <td>
                    {{ $detail->metode_pembelajaran }}<br><br>
                    <b>Waktu:</b> {{ $detail->estimasi_waktu }}
                </td>
                <td>{{ $detail->pengalaman_belajar }}</td>
                <td style="text-align: center;">{{ $detail->penilaian_bobot }}%</td>
            </tr>
            @endforeach
        </tbody>
    </table>

</body>
</html>