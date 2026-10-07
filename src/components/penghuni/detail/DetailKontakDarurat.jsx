export default function DetailKontakDarurat({ dataPenghuni }) {

    const kontakDarurat = dataPenghuni?.kontak_darurat || [];

    return (
        <div className="rounded-xl border border-slate-200 overflow-hidden">

            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
                <h3 className="text-base font-semibold text-slate-900">
                    Kontak Darurat
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                    Daftar orang yang dapat dihubungi ketika terjadi keadaan darurat.
                </p>
            </div>

            <div className="p-5 space-y-4">
                {kontakDarurat.length > 0 ? (

                    kontakDarurat.map((kontak, index) => (

                        <div
                            key={kontak.id || index}
                            className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                        >

                            <h4 className="font-semibold text-slate-800 mb-4">
                                Kontak Darurat #{index + 1}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div>
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                        Nama
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                        {kontak.nama || "-"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                        Hubungan
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                        {kontak.hubungan || "-"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                        Nomor HP
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                        {kontak.no_hp || "-"}
                                    </p>
                                </div>

                            </div>
                        </div>

                    ))

                ) : (

                    <div className="text-center py-6 text-sm text-slate-400">
                        Belum ada kontak darurat.
                    </div>

                )}
            </div>
        </div>
    );
}