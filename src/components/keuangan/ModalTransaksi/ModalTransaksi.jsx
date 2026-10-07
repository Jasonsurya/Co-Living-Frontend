import { useState } from "react";

import {
    X,
    ArrowLeft,
    ArrowRight,
    Wallet,
    Receipt,
} from "lucide-react";

import FormPemasukan from "./Form/FormPemasukan";
import FormPengeluaran from "./Form/FormPengeluaran";

export default function ModalTransaksi({
    isOpen,
    onClose,
    onSave,
}) {
    // ======================================================
    // STATE STEP
    // ======================================================

    const [step, setStep] = useState(1);

    // ======================================================
    // STATE JENIS TRANSAKSI
    // ======================================================

    const [jenisTransaksi, setJenisTransaksi] =
        useState(null);

    // ======================================================
    // JIKA MODAL TIDAK TERBUKA
    // ======================================================

    if (!isOpen) {
        return null;
    }

    // ======================================================
    // PILIH JENIS TRANSAKSI
    // ======================================================

    const handleSelectJenis = (jenis) => {
        setJenisTransaksi(jenis);
    };

    // ======================================================
    // LANJUT KE FORM
    // ======================================================

    const handleNext = () => {
        if (!jenisTransaksi) {
            alert(
                "Silakan pilih jenis transaksi terlebih dahulu."
            );
            return;
        }

        setStep(2);
    };

    // ======================================================
    // KEMBALI KE PILIH JENIS
    // ======================================================

    const handleBack = () => {
        setStep(1);
    };

    // ======================================================
    // TUTUP MODAL
    // ======================================================

    const handleClose = () => {
        setStep(1);
        setJenisTransaksi(null);

        onClose?.();
    };

    // ======================================================
    // TRANSAKSI BERHASIL DISIMPAN
    // ======================================================

    const handleSubmit = (hasilTransaksi) => {
        console.log(
            "Hasil transaksi dari form:",
            hasilTransaksi
        );

        // Kirim hasil ke KasHarian
        onSave?.(hasilTransaksi);

        // Tutup dan reset modal
        handleClose();
    };

    // ======================================================
    // RENDER
    // ======================================================

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            {/* OVERLAY */}
            <div
                className="absolute inset-0"
                onClick={handleClose}
            />

            {/* MODAL */}
            <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        {step === 2 && (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                                title="Kembali"
                            >
                                <ArrowLeft size={20} />
                            </button>
                        )}

                        <div>
                            <h2 className="text-lg font-bold text-slate-800">
                                {step === 1
                                    ? "Tambah Transaksi"
                                    : jenisTransaksi ===
                                      "pemasukan"
                                    ? "Tambah Pemasukan"
                                    : "Tambah Pengeluaran"}
                            </h2>

                            <p className="text-xs text-slate-500 mt-1">
                                {step === 1
                                    ? "Pilih jenis transaksi yang ingin dicatat."
                                    : jenisTransaksi ===
                                      "pemasukan"
                                    ? "Isi data transaksi uang masuk."
                                    : "Isi data transaksi uang keluar."}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* ======================================================
                    STEP 1
                ====================================================== */}

                {step === 1 && (
                    <div className="p-6">
                        <div className="mb-5">
                            <h3 className="text-sm font-bold text-slate-800">
                                Pilih Jenis Transaksi
                            </h3>

                            <p className="text-xs text-slate-500 mt-1">
                                Pilih salah satu jenis transaksi
                                sebelum melanjutkan.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* PEMASUKAN */}
                            <button
                                type="button"
                                onClick={() =>
                                    handleSelectJenis(
                                        "pemasukan"
                                    )
                                }
                                className={`
                                    group
                                    p-5
                                    rounded-2xl
                                    border-2
                                    text-left
                                    transition-all
                                    cursor-pointer
                                    ${
                                        jenisTransaksi ===
                                        "pemasukan"
                                            ? "border-emerald-500 bg-emerald-50"
                                            : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50"
                                    }
                                `}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`
                                            w-12
                                            h-12
                                            rounded-xl
                                            flex
                                            items-center
                                            justify-center
                                            ${
                                                jenisTransaksi ===
                                                "pemasukan"
                                                    ? "bg-emerald-500 text-white"
                                                    : "bg-emerald-100 text-emerald-600"
                                            }
                                        `}
                                    >
                                        <Wallet size={23} />
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-slate-800">
                                            Pemasukan
                                        </h4>

                                        <p className="text-xs text-slate-500 mt-1">
                                            Mencatat uang yang
                                            masuk.
                                        </p>
                                    </div>
                                </div>
                            </button>

                            {/* PENGELUARAN */}
                            <button
                                type="button"
                                onClick={() =>
                                    handleSelectJenis(
                                        "pengeluaran"
                                    )
                                }
                                className={`
                                    group
                                    p-5
                                    rounded-2xl
                                    border-2
                                    text-left
                                    transition-all
                                    cursor-pointer
                                    ${
                                        jenisTransaksi ===
                                        "pengeluaran"
                                            ? "border-red-500 bg-red-50"
                                            : "border-slate-200 bg-white hover:border-red-300 hover:bg-red-50/50"
                                    }
                                `}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`
                                            w-12
                                            h-12
                                            rounded-xl
                                            flex
                                            items-center
                                            justify-center
                                            ${
                                                jenisTransaksi ===
                                                "pengeluaran"
                                                    ? "bg-red-500 text-white"
                                                    : "bg-red-100 text-red-600"
                                            }
                                        `}
                                    >
                                        <Receipt size={23} />
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-slate-800">
                                            Pengeluaran
                                        </h4>

                                        <p className="text-xs text-slate-500 mt-1">
                                            Mencatat uang yang
                                            keluar.
                                        </p>
                                    </div>
                                </div>
                            </button>
                        </div>

                        {/* FOOTER */}
                        <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
                            >
                                Batal
                            </button>

                            <button
                                type="button"
                                onClick={handleNext}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
                            >
                                Selanjutnya
                                <ArrowRight size={15} />
                            </button>
                        </div>
                    </div>
                )}

                {/* ======================================================
                    STEP 2
                ====================================================== */}

                {step === 2 && (
                    <div>
                        {jenisTransaksi ===
                            "pemasukan" && (
                            <FormPemasukan
                                onSubmit={handleSubmit}
                                onBack={handleBack}
                            />
                        )}

                        {jenisTransaksi ===
                            "pengeluaran" && (
                            <FormPengeluaran
                                onSubmit={handleSubmit}
                                onBack={handleBack}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}