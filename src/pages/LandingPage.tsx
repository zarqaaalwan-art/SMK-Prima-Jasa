import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Monitor, 
  Code, 
  Camera, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  Clock 
} from 'lucide-react';

export default function LandingPage() {
  const majors = [
    {
      title: 'Teknik Komputer & Jaringan (TKJ)',
      description: 'Mempelajari instalasi jaringan LAN, WAN, server, serta perakitan dan perbaikan komputer.',
      icon: Monitor,
      color: 'bg-blue-500',
    },
    {
      title: 'Rekayasa Perangkat Lunak (RPL)',
      description: 'Fokus pada pengembangan aplikasi web, mobile, desktop, serta manajemen basis data.',
      icon: Code,
      color: 'bg-emerald-500',
    },
    {
      title: 'Multimedia',
      description: 'Mempelajari desain grafis, videografi, animasi 2D/3D, dan pengembangan konten kreatif.',
      icon: Camera,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary/20">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
              S
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">SMK Prima Unggul</span>
          </div>
          <Link 
            to="/login" 
            className="bg-primary hover:bg-accent text-white px-6 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-lg shadow-primary/20 active:scale-95"
          >
            Login Sistem
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold mb-6">
              Membangun Masa Depan Digital
            </span>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-8">
              Sistem Absensi <br />
              <span className="text-primary">SMK Prima Unggul</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-xl">
              Platform manajemen kehadiran terintegrasi untuk siswa dan staf. 
              Mewujudkan transparansi dan efisiensi dalam lingkungan pendidikan modern.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/login" 
                className="group bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
              >
                Mulai Sekarang
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href="#profile" 
                className="px-8 py-4 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
              >
                Pelajari Lebih Lanjut
              </a>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-primary/10 rounded-[40px] blur-3xl -z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000" 
              alt="SMK Prima Unggul" 
              className="rounded-[32px] shadow-2xl border-8 border-white object-cover aspect-[4/3]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 animate-bounce-slow">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Terverifikasi</p>
                <p className="text-xs text-gray-500">Sistem Aman & Terpercaya</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Profile Section */}
      <section id="profile" className="py-24 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Profil SMK Prima Unggul</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Sekolah kejuruan unggulan yang berfokus pada pengembangan kompetensi teknologi informasi dan komunikasi.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {majors.map((major, index) => {
              const Icon = major.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-10 rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                >
                  <div className={`w-16 h-16 ${major.color} text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{major.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {major.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="bg-blue-50 p-8 rounded-3xl">
                    <Users className="text-blue-600 mb-4" size={32} />
                    <p className="text-3xl font-bold text-gray-900">1000+</p>
                    <p className="text-gray-600 text-sm">Siswa Aktif</p>
                  </div>
                  <div className="bg-emerald-50 p-8 rounded-3xl">
                    <CheckCircle2 className="text-emerald-600 mb-4" size={32} />
                    <p className="text-3xl font-bold text-gray-900">99%</p>
                    <p className="text-gray-600 text-sm">Kehadiran Tepat Waktu</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-purple-50 p-8 rounded-3xl">
                    <Clock className="text-purple-600 mb-4" size={32} />
                    <p className="text-3xl font-bold text-gray-900">24/7</p>
                    <p className="text-gray-600 text-sm">Akses Real-time</p>
                  </div>
                  <div className="bg-orange-50 p-8 rounded-3xl">
                    <ShieldCheck className="text-orange-600 mb-4" size={32} />
                    <p className="text-3xl font-bold text-gray-900">A+</p>
                    <p className="text-gray-600 text-sm">Akreditasi Sekolah</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8 leading-tight">
                Mengapa Memilih Sistem Absensi Kami?
              </h2>
              <div className="space-y-6">
                {[
                  'Pemantauan kehadiran secara real-time untuk guru dan admin.',
                  'Rekapitulasi otomatis yang memudahkan pelaporan bulanan.',
                  'Antarmuka yang ramah pengguna dan responsif di semua perangkat.',
                  'Integrasi data siswa yang aman dan terpusat.',
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="mt-1 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 size={16} />
                    </div>
                    <p className="text-gray-700 font-medium">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  S
                </div>
                <span className="text-2xl font-bold tracking-tight">SMK Prima Unggul</span>
              </div>
              <p className="text-gray-400 max-w-sm leading-relaxed">
                Mencetak generasi unggul yang siap bersaing di era digital melalui pendidikan berkualitas dan teknologi modern.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6">Navigasi</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-primary transition-colors">Beranda</a></li>
                <li><a href="#profile" className="hover:text-primary transition-colors">Profil</a></li>
                <li><a href="/login" className="hover:text-primary transition-colors">Login</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Kontak</h4>
              <ul className="space-y-4 text-gray-400">
                <li>Jl. Pendidikan No. 123</li>
                <li>info@smkprimaunggul.sch.id</li>
                <li>(021) 1234-5678</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} SMK Prima Unggul. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
