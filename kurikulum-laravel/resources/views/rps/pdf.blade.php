<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>RPS - {{ $rps->mataKuliah->nama_mk }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @media print {
            body { -webkit-print-color-adjust: exact; }
        }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #000; padding: 4px; text-align: left; }
    </style>
</head>
<body class="p-10 text-xs leading-tight bg-white">
    <!-- Header Standar Polman -->
    <div class="flex items-center justify-between border-b-2 border-black pb-2 mb-4">
        <div class="w-20">
            <!-- Tempatkan Logo Polman jika ada -->
            <div class="font-bold text-lg">POLMAN</div>
        </div>
        <div class="text-center flex-1">
            <h1 class="text-lg font-bold uppercase">Rencana Pembelajaran Semester (RPS)</h1>
            <p class="font-semibold">{{ $rps->mataKuliah->nama_mk }} ({{ $rps->mataKuliah->kode_mk }})</p>
        </div>
        <div class="w-24 text-[8px] text-right">
            Halaman 1 dari 1
        </div>
    </div>

    <!-- Tabel Identitas -->
    <table class="mb-4">
        <tr class="bg-gray-100 font-bold uppercase">
            <td colspan="4">Identitas Mata Kuliah</td>
        </tr>
        <tr>
            <td class="w-1/4 font-bold">Mata Kuliah</td>
            <td class="w-1/4">{{ $rps->mataKuliah->nama_mk }}</td>
            <td class="w-1/4 font-bold">Semester</td>
            <td class="w-1/4">{{ $rps->semester_ke }}</td>
        </tr>
        <tr>
            <td class="font-bold">Tahun Akademik</td>
            <td>{{ $rps->tahun_akademik }}</td>
            <td class="font-bold">Dosen Pengampu</td>
            <td>{{ $rps->dosenPengampu->name }}</td>
        </tr>
    </table>

    <!-- Matriks Penilaian -->
    <table class="mb-4">
        <tr class="bg-gray-100 font-bold uppercase text-center">
            <td rowspan="2">CPMK</td>
            <td colspan="5">Bobot Penilaian (%)</td>
        </tr>
        <tr class="bg-gray-50 text-center font-semibold">
            <td>Kuis</td><td>Tugas</td><td>Project</td><td>UTS</td><td>UAS</td>
        </tr>
        @foreach($rps->penilaians as $nilai)
        <tr class="text-center">
            <td class="font-bold">{{ $nilai->cpmk->kode_cpmk }}</td>
            <td>{{ $nilai->kuis }}</td>
            <td>{{ $nilai->tugas }}</td>
            <td>{{ $nilai->project }}</td>
            <td>{{ $nilai->uts }}</td>
            <td>{{ $nilai->uas }}</td>
        </tr>
        @endforeach
    </table>

    <!-- Otorisasi -->
    <div class="mt-10 flex justify-between px-10">
        <div class="text-center">
            <p>Dosen Pengampu,</p>
            <div class="h-16"></div>
            <p class="font-bold underline">{{ $rps->dosenPengampu->name }}</p>
        </div>
        <div class="text-center">
            <p>Ketua Jurusan,</p>
            <div class="h-16"></div>
            <p class="font-bold underline">{{ $rps->nama_kajur }}</p>
        </div>
        <div class="text-center">
            <p>Ketua Program Studi,</p>
            <div class="h-16"></div>
            <p class="font-bold underline">{{ $rps->kaprodi->name }}</p>
        </div>
    </div>
</body>
</html>