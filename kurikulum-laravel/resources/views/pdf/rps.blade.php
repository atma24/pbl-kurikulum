<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Dokumen RPS</title>
    <style>
        body { font-family: 'Times New Roman', Times, serif; font-size: 11px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        th, td { border: 1px solid #000; padding: 5px; vertical-align: middle; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
        
        /* Warna Khusus Kop Surat & Tabel */
        .bg-kop { background-color: #e0f2f7; }
        .bg-gray { background-color: #d9d9d9; }
        
        .tte-img { max-height: 50px; max-width: 90px; }
    </style>
</head>
<body>

    <!-- KOP SURAT (SESUAI GAMBAR) -->
    <table>
        <tr class="bg-kop">
            <td width="20%" class="text-center">
                <!-- Pastikan kamu simpan file logo di folder public/images/polman-logo.png -->
                <img src="{{ public_path('images/polman-logo.png') }}" alt="Logo Polman" style="width: 80px;">
            </td>
            <td width="60%" class="text-center font-bold">
                Politeknik Manufaktur Bandung<br>
                Jurusan Teknik Otomasi Manufaktur dan Mekatronika<br>
                Program Studi {{ 
                    $rps->kode_dokumen == 'RPS_TRIN' ? 'Teknologi Rekayasa Informatika Industri' : 
                    ($rps->kode_dokumen == 'RPS_TRO' ? 'Teknologi Rekayasa Otomasi' : 'Teknologi Rekayasa Mekatronika') 
                }}
            </td>
            <td width="20%" class="text-center font-bold">
                {{ $rps->kode_dokumen }}_{{ $rps->mataKuliah->kode_mk }}
            </td>
        </tr>
        <tr class="bg-kop">
            <td colspan="3" class="text-center font-bold" style="font-size: 13px;">RENCANA PEMBELAJARAN SEMESTER (RPS)</td>
        </tr>
    </table>

    <!-- IDENTITAS MATA KULIAH -->
    <table>
        <tr><th colspan="4" class="bg-gray">IDENTITAS MATA KULIAH</th></tr>
        <tr>
            <td width="20%" class="font-bold">Mata Kuliah</td>
            <td width="30%">{{ $rps->mataKuliah->nama_mk }}</td>
            <td width="20%" class="font-bold">Kode MK</td>
            <td width="30%">{{ $rps->mataKuliah->kode_mk }}</td>
        </tr>
        <tr>
            <td class="font-bold">Dosen Pengampu</td>
            <td>{{ $rps->dosen->name }}</td>
            <td class="font-bold">Tahun Akademik</td>
            <td>{{ $rps->tahun_akademik }}</td>
        </tr>
        <tr>
            <td class="font-bold">Tanggal Penyusunan</td>
            <td colspan="3">{{ \Carbon\Carbon::parse($rps->tanggal_penyusunan)->translatedFormat('d F Y') }}</td>
        </tr>
    </table>
                        
    <!-- PENGESAHAN (TTE) -->
    <table>
        <tr><th colspan="3" class="bg-gray">OTORISASI / PENGESAHAN</th></tr>
        <tr>
            <th width="33.3%">Dosen Pengampu</th>
            <th width="33.3%">Kepala Program Studi</th>
            <th width="33.3%">Ketua Jurusan</th>
        </tr>
        <tr class="text-center">
            <td style="height: 60px;">
                @if($rps->tte_dosen) <img src="{{ public_path('storage/' . $rps->tte_dosen) }}" class="tte-img"> @endif
            </td>
            <td style="height: 60px;">
                @if($rps->tte_kaprodi) <img src="{{ public_path('storage/' . $rps->tte_kaprodi) }}" class="tte-img"> @endif
            </td>
            <td style="height: 60px;">
                @if($rps->tte_kajur) <img src="{{ public_path('storage/' . $rps->tte_kajur) }}" class="tte-img"> @endif
            </td>
        </tr>
    </table>
                        <!-- DESKRIPSI, CPL, INDIKATOR, DAN CPMK -->
    @php
        // 1. Ekstrak data CPMK dari Mata Kuliah
        $cpmks = $rps->mataKuliah->cpmks ?? collect();
        
        // 2. Kumpulkan semua Indikator Kinerja dari Many-to-Many
        $indikators = collect();
        foreach($cpmks as $cpmk) {
            foreach($cpmk->indikatorKinerjas as $ik) {
                $indikators->push($ik);
            }
        }
        // Buang duplikat agar CPL tidak ter-print berkali-kali
        $uniqueIndikators = $indikators->unique('id');
        
        // 3. Hitung ROWSPAN (tinggi baris) dinamis
        $jmlIndikator = $uniqueIndikators->count() > 0 ? $uniqueIndikators->count() : 1;
        $jmlCpmk = $cpmks->count() > 0 ? $cpmks->count() : 1;
        $rowspanCpl = 1 + $jmlIndikator + 1 + $jmlCpmk; 
    @endphp

    <table>
        <!-- DESKRIPSI MATA KULIAH -->
        <tr>
            <td width="15%" class="font-bold uppercase">Deskripsi Singkat</td>
            <td colspan="4">
                {{ $rps->mataKuliah->deskripsi ?? 'Tidak ada deskripsi.' }}
            </td>
        </tr>

        <!-- HEADER CPL -->
        <tr>
            <td rowspan="{{ $rowspanCpl }}" class="font-bold uppercase" style="vertical-align: top;">
                Capaian Pembelajaran (CPL)
            </td>
            <td colspan="2" class="text-center font-bold bg-gray">CPL-PRODI yang dibebankan pada MK</td>
            <td colspan="2" class="text-center font-bold bg-gray">Indikator Kinerja</td>
        </tr>
        
        <!-- LOOP DATA CPL & INDIKATOR -->
        @forelse($uniqueIndikators as $ind)
        <tr>
            <!-- Fallback: Coba kode_cpl, jika tidak ada pakai kode biasa -->
            <td width="10%" class="text-center">{{ $ind->cpl->kode_cpl ?? $ind->cpl->kode ?? '-' }}</td>
            <td width="30%">{{ $ind->cpl->deskripsi ?? '-' }}</td>
            
            <td width="10%" class="text-center">{{ $ind->kode ?? '-' }}</td>
            <td width="35%">{{ $ind->deskripsi ?? '-' }}</td>
        </tr>
        @empty
        <tr><td colspan="4" class="text-center text-gray-500">Data CPL/Indikator belum dipetakan di Master Data.</td></tr>
        @endforelse

        <!-- HEADER CPMK -->
        <tr>
            <td colspan="4" class="font-bold bg-gray">Capaian Pembelajaran Mata Kuliah (CPMK)</td>
        </tr>

        <!-- LOOP DATA CPMK -->
        @forelse($cpmks as $cpmk)
        <tr>
            <!-- Karena 1 CPMK bisa punya banyak Indikator, kita gabungkan kodenya pakai koma -->
            <td class="text-center font-bold">
                {{ $cpmk->indikatorKinerjas->pluck('kode')->join(', ') ?: '-' }}
            </td>
            <td width="10%" class="font-bold text-center">{{ $cpmk->kode_cpmk }}</td>
            <td colspan="2">{{ $cpmk->deskripsi }}</td>
        </tr>
        @empty
        <tr><td colspan="4" class="text-center text-gray-500">Data CPMK belum ada di Master Data.</td></tr>
        @endforelse
    </table>
    <!-- BAHAN KAJIAN & PUSTAKA -->
    <table>
        <tr>
            <td width="20%" class="font-bold">Bahan Kajian Utama</td>
            <td width="80%">{!! nl2br(e($rps->bahan_kajian_utama)) !!}</td>
        </tr>
        <tr>
            <td class="font-bold">Pustaka Utama</td>
            <td>{!! nl2br(e($rps->pustaka_utama)) !!}</td>
        </tr>
        <tr>
            <td class="font-bold">Pustaka Pendukung</td>
            <td>{!! nl2br(e($rps->pustaka_pendukung)) !!}</td>
        </tr>
    </table>

    <!-- MATRIKS PENILAIAN DENGAN TOTAL OTOMATIS -->
    @if($rps->penilaians->count() > 0)
    Sistem <b>evaluasi</b> atau <b>penilaian</b> diberikan dengan ketentuan sebagai berikut:
    <table style="margin-top: 5px;">
        <tr class="text-center font-bold bg-gray">
            <td rowspan="2" width="15%">CPMK</td>
            <td colspan="5">Bobot per Bentuk Penilaian (%)</td>
            <td rowspan="2" width="15%">Total Bobot Per CPMK</td>
        </tr>
        <tr class="text-center font-bold bg-gray">
            <td>Quiz</td>
            <td>Tugas</td>
            <td>Project</td>
            <td>UTS</td>
            <td>UAS</td>
        </tr>
        
        @php
            // Variabel Penampung Kolom
            $sumQuiz = 0; $sumTugas = 0; $sumProject = 0; $sumUts = 0; $sumUas = 0;
            $grandTotal = 0;
        @endphp

        @foreach($rps->penilaians as $nilai)
            @php
                // Kalkulasi Baris
                $rowTotal = $nilai->quiz + $nilai->tugas + $nilai->project + $nilai->uts + $nilai->uas;
                
                // Tambahkan ke Total Kolom
                $sumQuiz += $nilai->quiz;
                $sumTugas += $nilai->tugas;
                $sumProject += $nilai->project;
                $sumUts += $nilai->uts;
                $sumUas += $nilai->uas;
                $grandTotal += $rowTotal;
            @endphp
            <tr class="text-center">
                <td>{{ $nilai->cpmk->kode_cpmk ?? 'N/A' }}</td>
                <td>{{ $nilai->quiz > 0 ? floatval($nilai->quiz) : '-' }}</td>
                <td>{{ $nilai->tugas > 0 ? floatval($nilai->tugas) : '-' }}</td>
                <td>{{ $nilai->project > 0 ? floatval($nilai->project) : '-' }}</td>
                <td>{{ $nilai->uts > 0 ? floatval($nilai->uts) : '-' }}</td>
                <td>{{ $nilai->uas > 0 ? floatval($nilai->uas) : '-' }}</td>
                <td class="font-bold">{{ floatval($rowTotal) }}</td>
            </tr>
        @endforeach

        <!-- BARIS TOTAL BAWAH -->
        <tr class="text-center font-bold bg-gray">
            <td style="text-align: left;">Total Penilaian</td>
            <td>{{ floatval($sumQuiz) }}</td>
            <td>{{ floatval($sumTugas) }}</td>
            <td>{{ floatval($sumProject) }}</td>
            <td>{{ floatval($sumUts) }}</td>
            <td>{{ floatval($sumUas) }}</td>
            <td>{{ floatval($grandTotal) }}</td>
        </tr>
    </table>
    @endif

    <div style="page-break-before: always;"></div>
    
    <!-- DETAIL MINGGUAN -->
    <table>
        <tr><th colspan="6" class="bg-gray">RENCANA PEMBELAJARAN MINGGUAN</th></tr>
        <tr>
            <th width="5%">Mg Ke</th>
            <th width="20%">Kemampuan Akhir</th>
            <th width="20%">Bahan Kajian</th>
            <th width="20%">Metode & Waktu</th>
            <th width="25%">Pengalaman & Indikator</th>
            <th width="10%">Bobot (%)</th>
        </tr>
        @foreach($rps->details as $dt)
        <tr>
            <td class="text-center">{{ $dt->minggu_ke }}</td>
            <td>{!! nl2br(e($dt->kemampuan_akhir)) !!}</td>
            <td>{!! nl2br(e($dt->bahan_kajian)) !!}</td>
            <td>
                <b>Metode:</b><br>{{ $dt->metode_pembelajaran }}<br><br>
                <b>Waktu:</b><br>{{ $dt->estimasi_waktu }}
            </td>
            <td>
                <b>Pengalaman:</b><br>{{ $dt->pengalaman_belajar }}<br><br>
                <b>Indikator:</b><br>{{ $dt->indikator }}<br><br>
                <b>Komponen:</b> {{ $dt->penilaian_komponen }}
            </td>
            <td class="text-center">{{ floatval($dt->penilaian_bobot) }}</td>
        </tr>
        @endforeach
    </table>

</body>
</html>