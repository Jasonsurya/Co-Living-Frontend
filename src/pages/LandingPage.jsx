import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo Co-Living Pagul.png";
import HeroImage from "../assets/HeroSection.jpeg";
import KamarTidur from "../assets/Kamar_Tidur.jpeg";
import KamarMandi from "../assets/Kamar_Mandi.jpeg";
import RuangKumpul from "../assets/Ruang_Kumpul.jpeg";
import Dapur from "../assets/Dapur.jpeg";
import Parkiran from "../assets/Parkiran.jpeg";
import AreaDepan from "../assets/Area_Depan.jpeg";

import {
  Lock,
  Tv,
  Snowflake,
  BedDouble,
  Briefcase,
  Bath,
  Wifi,
  Sofa,
  Utensils,
  Building2,
  Camera,
  Car,
} from "lucide-react";

const galeriData = [
  { id: 1, title: 'Area Depan & Teras', category: 'Exterior', src: AreaDepan, span: 'md:col-span-2 md:row-span-2 h-96 md:h-full' },
  { id: 2, title: 'Kamar Mandi', category: 'Bathroom', src: KamarMandi, span: 'col-span-1 h-64 md:h-full' },
  { id: 3, title: 'Area Kumpul', category: 'Communal Space', src: RuangKumpul, span: 'col-span-1 h-64 md:h-full' },
  { id: 4, title: 'Dapur Bersama', category: 'Shared Kitchen', src: Dapur, span: 'col-span-1 h-64 md:h-full' },
  { id: 5, title: 'Tempat Parkir', category: 'Facility', src: Parkiran, span: 'col-span-1 h-64 md:h-full' },
  { id: 6, title: 'Kamar Tidur Utama', category: 'Private Room', src: KamarTidur, span: 'col-span-1 h-64 md:h-full' },
];

const kontakData = {
  email: "colivingpagul@gmail.com",
  instagram: "@coliving.pagul",
  instagramUrl: "https://instagram.com",
  whatsapp: "6281234567890",
  whatsappUrl: "https://wa.me/6285383444873",
  alamatLengkap: "Jl. Maulana Yusuf Gg. Fatimah No.16, Palapa, Tanjung Karang Pusat, Bandar Lampung.",
  mapEmbedUrl: "https://maps.google.com/maps?q=-5.416291723375914,105.25177346980607&z=15&output=embed",
};

export default function LandingPage() {
  const navigate = useNavigate();

  const handleBukaLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-800">

      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={Logo}
              alt="Logo Co-Living Pagul"
              className="h-11 w-auto object-contain"
            />
            <div className="text-lg font-black text-slate-950 tracking-tight">
              CO-LIVING <span className="font-normal text-slate-600">PAGUL</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8 font-semibold text-sm text-slate-600">
            <a href="#home" className="hover:text-slate-950 transition-colors">Beranda</a>
            <a href="#fasilitas" className="hover:text-slate-950 transition-colors">Fasilitas</a>
            <a href="#galeri" className="hover:text-slate-950 transition-colors">Galeri</a>
            <a href="#kamar" className="hover:text-slate-950 transition-colors">Kamar</a>
            <a href="#tentang" className="hover:text-slate-950 transition-colors">Tentang Kami</a>
            <a href="#kontak" className="hover:text-slate-950 transition-colors">Kontak</a>
          </div>

          <div>
            <button
              onClick={handleBukaLogin}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              Masuk
            </button>
          </div>
        </div>
      </nav>

      <section id="home" className="relative overflow-hidden bg-[#D8D7D8] border-b border-slate-300/30">
        <div className="absolute -top-40 -left-40 w-105 h-105 rounded-full bg-white/30 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-112.5 h-112.5 rounded-full bg-slate-500/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 py-14 md:py-16 lg:py-20">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-center">
            <div className="max-w-xl">
              <div className="inline-flex mb-7">
                <div className="px-5 py-2.5 rounded-full bg-white/80 border border-slate-400/50 shadow-[0_6px_18px_rgba(71,85,105,0.15)] backdrop-blur-sm">
                  <span className="text-xs md:text-sm font-semibold tracking-wide text-slate-700">
                    Kos Premium di Pusat Bandar Lampung
                  </span>
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[4.2rem] font-black leading-[1.02] tracking-[-0.035em] text-slate-950">
                Your Urban
                <span className="block">Sanctuary</span>
              </h1>

              <div className="w-16 h-1 bg-slate-900 rounded-full my-7" />

              <div className="max-w-lg space-y-4 text-slate-700">
                <p className="text-sm md:text-base lg:text-[17px] leading-7">
                  Hunian co-living premium untuk profesional muda dan eksekutif
                  yang menginginkan kenyamanan, privasi, dan ketenangan tanpa
                  harus jauh dari pusat aktivitas kota.
                </p>
                <p className="text-sm md:text-base lg:text-[17px] leading-7">
                  Kamar siap huni, fasilitas lengkap, layanan yang praktis,
                  dan suasana yang dirancang untuk membuat Anda merasa nyaman.
                </p>
              </div>

              <div className="mt-8">
                <div className="inline-flex bg-white rounded-2xl px-7 py-4 border border-slate-200 shadow-[0_10px_25px_rgba(71,85,105,0.12)]">
                  <div>
                    <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-slate-400 mb-0.5">
                      Mulai Dari
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl md:text-3xl font-black text-slate-950">
                        Rp1,8 Juta
                      </span>
                      <span className="text-sm text-slate-500 font-medium">
                        /bulan
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-5 -right-5 w-full h-full rounded-[3rem] border border-slate-400/40 bg-slate-300/10" />
              <div className="absolute -bottom-8 -left-8 w-44 h-44 rounded-full bg-slate-500/10 blur-3xl" />

              <div className="relative">
                <div className="relative rounded-[3rem] bg-slate-800 p-1.25 shadow-[0_25px_55px_rgba(51,65,85,0.30)]">
                  <div className="relative h-85 sm:h-100 lg:h-125 overflow-hidden rounded-[2.7rem]">
                    <img
                      src={HeroImage}
                      alt="Co-Living Pagul"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/15 via-transparent to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="fasilitas" className="bg-[#E3E2E4] border-t border-slate-300/50">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-24">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-950">
              Fasilitas
            </h2>
            <div className="w-14 h-1 bg-slate-900 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="mb-20">
            <div className="max-w-3xl mb-8">
              <p className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-950 mb-2">
                Fasilitas Kamar
              </p>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800">
                Everything You Need,
                <span className="block">Ready for You.</span>
              </h3>
              <div className="w-14 h-1 bg-slate-900 rounded-full mt-4 mb-4"></div>
              <p className="text-base md:text-lg leading-7 text-slate-600 max-w-2xl">
                Setiap kamar telah dilengkapi berbagai kebutuhan untuk
                mendukung aktivitas, kenyamanan, dan waktu istirahat Anda.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="group bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start justify-between mb-7">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <Lock size={22} strokeWidth={2} className="text-slate-800" />
                  </div>
                  <span className="text-xs font-bold text-slate-300">01</span>
                </div>
                <h4 className="text-xl font-bold text-slate-950 mb-2">Smart Living</h4>
                <p className="text-sm text-slate-500 leading-6 mb-5">
                  Teknologi praktis untuk membuat aktivitas sehari-hari menjadi lebih mudah dan aman.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">
                    <Lock size={14} /> Smart Lock
                  </span>
                  <span className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">
                    <Tv size={14} /> Smart TV
                  </span>
                </div>
              </div>

              <div className="group bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start justify-between mb-7">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <Snowflake size={22} className="text-slate-800" />
                  </div>
                  <span className="text-xs font-bold text-slate-300">02</span>
                </div>
                <h4 className="text-xl font-bold text-slate-950 mb-2">Everyday Comfort</h4>
                <p className="text-sm text-slate-500 leading-6 mb-5">
                  Kebutuhan utama untuk memastikan kamar tetap nyaman sepanjang hari.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">AC</span>
                  <span className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">
                    <BedDouble size={14} /> Kasur
                  </span>
                  <span className="px-3 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">Bedding</span>
                  <span className="px-3 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">Lemari</span>
                </div>
              </div>

              <div className="group bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start justify-between mb-7">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <Briefcase size={22} className="text-slate-800" />
                  </div>
                  <span className="text-xs font-bold text-slate-300">03</span>
                </div>
                <h4 className="text-xl font-bold text-slate-950 mb-2">Work Space</h4>
                <p className="text-sm text-slate-500 leading-6 mb-5">
                  Ruang kerja sederhana yang mendukung aktivitas belajar, bekerja, maupun aktivitas produktif lainnya.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">Meja Kerja</span>
                  <span className="px-3 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">Kursi</span>
                </div>
              </div>

              <div className="group bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start justify-between mb-7">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <Bath size={22} className="text-slate-800" />
                  </div>
                  <span className="text-xs font-bold text-slate-300">04</span>
                </div>
                <h4 className="text-xl font-bold text-slate-950 mb-2">Private Bathroom</h4>
                <p className="text-sm text-slate-500 leading-6 mb-5">
                  Kamar mandi pribadi dengan perlengkapan dasar yang menunjang kebutuhan harian.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">Water Heater</span>
                  <span className="px-3 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">Shower</span>
                  <span className="px-3 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">WC</span>
                  <span className="px-3 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">Wastafel</span>
                </div>
              </div>

              <div className="group bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start justify-between mb-7">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <Building2 size={22} className="text-slate-800" />
                  </div>
                  <span className="text-xs font-bold text-slate-300">05</span>
                </div>
                <h4 className="text-xl font-bold text-slate-950 mb-2">Ready to Move In</h4>
                <p className="text-sm text-slate-500 leading-6 mb-5">
                  Furnitur dasar telah tersedia sehingga kamar siap digunakan tanpa perlu banyak persiapan.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">Rak Sepatu</span>
                  <span className="px-3 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">Furnitur Lengkap</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5 mb-20">
            <div className="h-px flex-1 bg-slate-300/70"></div>
            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
            <div className="h-px flex-1 bg-slate-300/70"></div>
          </div>

          <div>
            <div className="max-w-3xl mb-12">
              <p className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-950 mb-3">
                Fasilitas Bersama
              </p>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800">
                Shared Spaces,
                <span className="block">Thoughtfully Designed.</span>
              </h3>
              <div className="w-14 h-1 bg-slate-900 rounded-full mt-4 mb-4"></div>
              <p className="text-base md:text-lg leading-7 text-slate-600 max-w-2xl">
                Ruang komunal yang membuat kehidupan sehari-hari terasa
                lebih fleksibel, tanpa mengurangi kenyamanan ruang pribadi Anda.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
                  <Wifi size={22} className="text-slate-800" />
                </div>
                <h4 className="text-lg font-bold text-slate-950 mb-2">Wi-Fi</h4>
                <p className="text-sm text-slate-500 leading-6">
                  Koneksi internet yang mendukung aktivitas kerja, belajar, dan hiburan sehari-hari.
                </p>
              </div>

              <div className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
                  <Sofa size={22} className="text-slate-800" />
                </div>
                <h4 className="text-lg font-bold text-slate-950 mb-2">Ruang Komunal</h4>
                <p className="text-sm text-slate-500 leading-6">
                  Area bersama untuk bersantai, berinteraksi, atau menikmati waktu luang.
                </p>
              </div>

              <div className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
                  <Utensils size={22} className="text-slate-800" />
                </div>
                <h4 className="text-lg font-bold text-slate-950 mb-2">Dapur</h4>
                <p className="text-sm text-slate-500 leading-6">
                  Area dapur bersama yang praktis untuk kebutuhan memasak dan aktivitas sehari-hari.
                </p>
              </div>

              <div className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
                  <Building2 size={22} className="text-slate-800" />
                </div>
                <h4 className="text-lg font-bold text-slate-950 mb-2">Rooftop</h4>
                <p className="text-sm text-slate-500 leading-6">
                  Area terbuka untuk bersantai dan menikmati suasana hunian dari ruang yang lebih luas.
                </p>
              </div>

              <div className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
                  <Camera size={22} className="text-slate-800" />
                </div>
                <h4 className="text-lg font-bold text-slate-950 mb-2">CCTV 24 Jam</h4>
                <p className="text-sm text-slate-500 leading-6">
                  Pemantauan area strategis untuk membantu menjaga keamanan lingkungan hunian.
                </p>
              </div>

              <div className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
                  <Car size={22} className="text-slate-800" />
                </div>
                <h4 className="text-lg font-bold text-slate-950 mb-2">Parkir</h4>
                <p className="text-sm text-slate-500 leading-6">
                  Area parkir yang disediakan untuk menunjang mobilitas penghuni sehari-hari.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="galeri" className="bg-[#E3E2E4] py-24 border-t border-slate-300/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">
              Visual Experience
            </p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-950">
              Galeri Co-Living Pagul
            </h2>
            <div className="w-14 h-1 bg-slate-900 mx-auto mt-4 mb-5 rounded-full"></div>
            <p className="text-base md:text-lg leading-7 text-slate-600">
              Jelajahi setiap sudut suasana hunian yang tenang, bersih, dan fungsional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[220px]">
            {galeriData.map((item) => (
              <div
                key={item.id}
                className={`relative group overflow-hidden rounded-3xl border border-slate-300/70 bg-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 ${item.span}`}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

                <div className="absolute top-4 left-4">
                  <span className="px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/40 text-[10px] font-bold uppercase tracking-widest text-slate-900 shadow-sm">
                    {item.category}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {item.title}
                  </h3>
                  <div className="w-8 h-0.5 bg-white/70 rounded-full mt-2.5 opacity-0 group-hover:opacity-100 group-hover:w-12 transition-all duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="kamar" className="bg-[#E3E2E4] border-t border-slate-300/50">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500 mb-3">
              Room Section
            </p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-950">
              Find Your Space
            </h2>
            <div className="w-14 h-1 bg-slate-900 mx-auto mt-4 mb-5 rounded-full" />
            <p className="text-base md:text-lg leading-7 text-slate-600">
              Dua pilihan kamar, satu standar kenyamanan.
              <br className="hidden sm:block" />
              Pilih ruang yang sesuai dengan kebutuhan Anda.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-7">
            <div className="group bg-white rounded-4xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="relative h-64 md:h-72 bg-slate-200 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white/70 flex items-center justify-center">
                      <span className="text-2xl">🏠</span>
                    </div>
                    <p className="text-sm font-bold uppercase tracking-[0.15em] text-slate-500">
                      Foto Standard Room
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Image placeholder</p>
                  </div>
                </div>
                <div className="absolute top-5 left-5">
                  <span className="inline-flex px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-white shadow-sm text-xs font-bold uppercase tracking-[0.12em] text-slate-700">
                    Standard Room
                  </span>
                </div>
              </div>

              <div className="p-7 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 mb-2">
                      Standard Room
                    </p>
                    <h3 className="text-2xl md:text-3xl font-black tracking-tight text-slate-950">
                      Comfortably Yours
                    </h3>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 mb-1">
                      Mulai dari
                    </p>
                    <p className="text-2xl font-black text-slate-950">
                      Rp1.800.000
                      <span className="text-sm font-medium text-slate-500"> /bulan</span>
                    </p>
                  </div>
                </div>

                <div className="h-px bg-slate-200 mb-7" />

                <div>
                  <h4 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-700 mb-4">
                    Fasilitas
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-x-5 gap-y-3">
                    {[
                      "Smart Lock",
                      "AC",
                      "Smart TV",
                      "Meja belajar",
                      "Kursi",
                      "Single Bed",
                      "Kasur",
                      "Set bantal & guling",
                      "Sprei",
                      "Lemari",
                      "Kamar mandi pribadi",
                      "Water Heater",
                      "Shower",
                      "WC",
                      "Wastafel",
                      "Rak sepatu",
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                        <span className="shrink-0 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                          <span className="text-[11px] font-bold text-slate-700">✓</span>
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 mb-3">Add Service</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600">
                      Room Cleaning
                    </span>
                    <span className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600">
                      Maintenance
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-4xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="relative h-64 md:h-72 bg-slate-200 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white/70 flex items-center justify-center">
                      <span className="text-2xl">✨</span>
                    </div>
                    <p className="text-sm font-bold uppercase tracking-[0.15em] text-slate-500">
                      Foto Premium Room
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Image placeholder</p>
                  </div>
                </div>
                <div className="absolute top-5 left-5">
                  <span className="inline-flex px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-white shadow-sm text-xs font-bold uppercase tracking-[0.12em] text-slate-700">
                    Premium Room
                  </span>
                </div>
              </div>

              <div className="p-7 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 mb-2">
                      Premium Room
                    </p>
                    <h3 className="text-2xl md:text-3xl font-black tracking-tight text-slate-950">
                      More Space. More Light.
                    </h3>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 mb-1">
                      Mulai dari
                    </p>
                    <p className="text-2xl font-black text-slate-950">
                      Rp2.000.000
                      <span className="text-sm font-medium text-slate-500"> /bulan</span>
                    </p>
                  </div>
                </div>

                <div className="h-px bg-slate-200 mb-7" />

                <div>
                  <h4 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-700 mb-4">
                    Semua fasilitas Standard tetap tersedia
                  </h4>
                  <p className="text-sm leading-6 text-slate-500 mb-5">
                    Premium Room menawarkan ruang yang lebih lega dengan pencahayaan alami yang lebih optimal.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="shrink-0 w-9 h-9 rounded-xl bg-white flex items-center justify-center">
                      <span className="text-sm">🛏️</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Queen Bed</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Ukuran kasur lebih besar untuk kenyamanan tambahan.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="shrink-0 w-9 h-9 rounded-xl bg-white flex items-center justify-center">
                      <span className="text-sm">☀️</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">2 Jendela</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Pencahayaan alami yang lebih optimal di dalam kamar.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="shrink-0 w-9 h-9 rounded-xl bg-white flex items-center justify-center">
                      <span className="text-sm">🧹</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Room Cleaning</p>
                      <p className="text-xs text-slate-500 mt-1">Layanan kebersihan kamar.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="shrink-0 w-9 h-9 rounded-xl bg-white flex items-center justify-center">
                      <span className="text-sm">🔧</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Maintenance</p>
                      <p className="text-xs text-slate-500 mt-1">Dukungan perawatan fasilitas kamar.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-5 rounded-2xl bg-slate-900 text-white">
                  <p className="text-xs uppercase tracking-[0.15em] font-bold text-slate-400 mb-2">
                    Upgrade Your Space
                  </p>
                  <p className="text-sm leading-6 text-slate-200">
                    Nikmati ruang yang lebih luas dan pencahayaan alami dengan tambahan hanya
                  </p>
                  <p className="text-xl font-black mt-2">
                    Rp200.000
                    <span className="text-sm font-medium text-slate-400"> /bulan</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="why-pagul" className="bg-[#E3E2E4] border-t border-slate-300/50">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">
              Why Pagul Co-Living?
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-950">
              Premium, Without Feeling Distant.
            </h2>
            <div className="w-14 h-1 bg-slate-900 rounded-full mx-auto mt-6" />
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            <div className="group bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-bold tracking-[0.18em] text-slate-400">01</span>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Precision</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-950 tracking-tight mb-4">
                Thoughtfully Considered
              </h3>
              <p className="text-sm md:text-base text-slate-600 leading-7">
                Setiap detail dirancang untuk menghadirkan pengalaman tinggal
                yang rapi, nyaman, dan berfungsi sebagaimana mestinya.
              </p>
            </div>

            <div className="group bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-bold tracking-[0.18em] text-slate-400">02</span>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Authentic</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-950 tracking-tight mb-4">
                Warm & Genuine
              </h3>
              <p className="text-sm md:text-base text-slate-600 leading-7">
                Pelayanan profesional yang tetap hangat, tulus, dan tidak
                terasa kaku.
              </p>
            </div>

            <div className="group bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-bold tracking-[0.18em] text-slate-400">03</span>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Grounded</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-950 tracking-tight mb-4">
                Feels Like Home
              </h3>
              <p className="text-sm md:text-base text-slate-600 leading-7">
                Modern dalam fasilitas dan pengalaman, tetapi tetap membawa
                rasa hangat seperti di rumah sendiri.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="tentang" className="bg-[#E3E2E4] border-t border-slate-300/50">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-3xl mb-14">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500 mb-4">
              Tentang Pagul
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-[-0.035em] leading-[1.05] text-slate-950">
              Live in the City.
              <span className="block">Come Home to Calm.</span>
            </h2>
            <div className="w-14 h-1 bg-slate-900 rounded-full my-7" />
            <p className="text-base md:text-lg leading-7 text-slate-600 max-w-2xl">
              Pagul berada di pusat Bandar Lampung, dekat dengan berbagai
              pusat aktivitas kota. Tinggal lebih dekat dengan kebutuhan
              sehari-hari, tanpa kehilangan kenyamanan dan ketenangan.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-stretch">
            <div className="relative min-h-105 rounded-4xl overflow-hidden border border-slate-300 bg-slate-200 shadow-lg shadow-slate-900/5">
              <iframe
                src={kontakData.mapEmbedUrl}
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Co-Living Pagul"
              />
              <div className="absolute left-5 top-5">
                <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-white shadow-lg">
                  <p className="text-[9px] uppercase tracking-[0.18em] font-bold text-slate-400">
                    Lokasi Pagul
                  </p>
                  <p className="text-sm font-bold text-slate-900 mt-1">
                    Pusat Bandar Lampung
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-4xl border border-slate-200 shadow-sm p-8 md:p-9 flex flex-col">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 mb-3">
                Find Us Here
              </p>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight text-slate-950">
                Strategically Located.
              </h3>
              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Alamat
                </p>
                <p className="text-sm md:text-base leading-6 font-medium text-slate-700">
                  Jl. Maulana Yusuf Gg. Fatimah No.16, Palapa, Tanjung Karang Pusat, Bandar Lampung.
                </p>
              </div>

              <div className="h-px bg-slate-200 my-7" />

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Nearby
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-slate-700">01</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-800">Mall Kartini</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">± 2 min</span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-slate-700">02</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-800">Tugu Adipura</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">± 5 min</span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-slate-700">03</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-800">Pusat Perkantoran</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">Nearby</span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-slate-700">04</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-800">Stasiun Tj. Karang</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">± 6 min</span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-slate-700">05</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-800">RSUD Abdoel Moeloek</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">± 8 min</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-8">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=-5.41642004808842,105.25170592886415"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold py-3.5 px-5 rounded-xl shadow-lg shadow-slate-900/10 transition-all duration-300 active:scale-[0.98]"
                >
                  Lihat Lokasi di Google Maps
                  <span className="text-base">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="kontak" className="bg-[#E3E2E4] border-t border-slate-300/50">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500 mb-4">
              Hubungi Kami
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-950">
              Kami Siap Membantu
            </h2>
            <div className="w-14 h-1 bg-slate-900 rounded-full mx-auto mt-6 mb-6" />
            <p className="text-base md:text-lg leading-7 text-slate-600">
              Punya pertanyaan, butuh informasi lebih lanjut, atau ingin
              melakukan reservasi? Jangan ragu untuk menghubungi kami melalui kanal berikut.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <a
              href={kontakData.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="group bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 text-2xl group-hover:scale-105 transition-transform">
                  💬
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400 mb-1">
                    WhatsApp
                  </p>
                  <p className="text-lg font-bold text-slate-950 truncate">
                    +{kontakData.whatsapp}
                  </p>
                </div>
                <div className="w-10 h-10 shrink-0 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-all">
                  ↗
                </div>
              </div>
              <p className="text-sm text-slate-500 leading-6 mt-6">
                Chat langsung dengan kami untuk mendapatkan respons lebih cepat.
              </p>
            </a>

            <a
              href={kontakData.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="group bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 text-2xl group-hover:scale-105 transition-transform">
                  📸
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400 mb-1">
                    Instagram
                  </p>
                  <p className="text-lg font-bold text-slate-950 truncate">
                    {kontakData.instagram}
                  </p>
                </div>
                <div className="w-10 h-10 shrink-0 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-all">
                  ↗
                </div>
              </div>
              <p className="text-sm text-slate-500 leading-6 mt-6">
                Ikuti kami untuk mendapatkan informasi terbaru dan berbagai aktivitas Co-Living Pagul.
              </p>
            </a>

            <a
              href={`mailto:${kontakData.email}`}
              className="group bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 text-2xl group-hover:scale-105 transition-transform">
                  ✉️
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400 mb-1">
                    Email
                  </p>
                  <p className="text-lg font-bold text-slate-950 truncate">
                    {kontakData.email}
                  </p>
                </div>
                <div className="w-10 h-10 shrink-0 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-all">
                  ↗
                </div>
              </div>
              <p className="text-sm text-slate-500 leading-6 mt-6">
                Untuk pertanyaan lebih lanjut, silakan kirim email kepada kami.
              </p>
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
          <div>
            &copy; 2026 Co-Living Pagul. All rights reserved.
          </div>
          <div className="flex space-x-6 text-slate-500">
            <span>Sistem Administrasi Back-Office v1.0</span>
          </div>
        </div>
      </footer>

    </div>
  );
}