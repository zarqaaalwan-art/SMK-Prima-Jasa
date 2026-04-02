import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  Calendar, 
  TrendingUp, 
  Clock,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function Dashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalStudents: 0,
    todayAttendance: 0,
    studentAttendance: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [profile]);

  const fetchStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const [
        { count: empCount },
        { count: stdCount },
        { count: todayEmpAtt },
        { count: todayStdAtt }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('students').select('*', { count: 'exact', head: true }),
        supabase.from('employee_attendance').select('*', { count: 'exact', head: true }).eq('date', today),
        supabase.from('student_attendance').select('*', { count: 'exact', head: true }).eq('date', today)
      ]);

      setStats({
        totalEmployees: empCount || 0,
        totalStudents: stdCount || 0,
        todayAttendance: todayEmpAtt || 0,
        studentAttendance: todayStdAtt || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'Total Karyawan',
      value: stats.totalEmployees,
      icon: Users,
      color: 'bg-blue-500',
      roles: ['admin']
    },
    {
      title: 'Total Siswa',
      value: stats.totalStudents,
      icon: GraduationCap,
      color: 'bg-emerald-500',
      roles: ['admin', 'guru']
    },
    {
      title: 'Absensi Karyawan Hari Ini',
      value: stats.todayAttendance,
      icon: UserCheck,
      color: 'bg-orange-500',
      roles: ['admin']
    },
    {
      title: 'Absensi Siswa Hari Ini',
      value: stats.studentAttendance,
      icon: TrendingUp,
      color: 'bg-purple-500',
      roles: ['admin', 'guru']
    }
  ].filter(card => profile && card.roles.includes(profile.role));

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Halo, {profile?.full_name}! 👋
          </h2>
          <p className="text-gray-500 font-medium">
            Selamat datang kembali di Sistem Absensi SMK Prima Unggul.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
          <Calendar className="text-primary" size={24} />
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tanggal Hari Ini</p>
            <p className="text-sm font-bold text-gray-900">
              {format(new Date(), 'EEEE, d MMMM yyyy', { locale: id })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-300">
              <div className={`w-14 h-14 ${card.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon size={28} />
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{card.title}</p>
              <p className="text-4xl font-extrabold text-gray-900">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Info Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-900">Informasi Terkini</h3>
            <button className="text-primary font-bold text-sm hover:underline">Lihat Semua</button>
          </div>
          <div className="space-y-4">
            {[
              { title: 'Rapat Koordinasi Guru', time: '08:00 - 09:00', date: 'Besok', type: 'Meeting' },
              { title: 'Input Nilai Akhir Semester', time: 'Deadline', date: '15 Apr 2026', type: 'Task' },
              { title: 'Update Sistem Absensi v2.0', time: 'Completed', date: 'Hari Ini', type: 'System' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 font-bold shrink-0">
                  {item.type.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.type} • {item.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-primary text-white p-8 rounded-[32px] shadow-xl shadow-primary/20 relative overflow-hidden">
          <div className="relative z-10">
            <Clock size={48} className="mb-6 opacity-80" />
            <h3 className="text-2xl font-bold mb-4 leading-tight">Jangan Lupa Absen Hari Ini!</h3>
            <p className="text-white/80 mb-8 leading-relaxed">
              Pastikan Anda melakukan absensi tepat waktu untuk menjaga kedisiplinan dan profesionalisme.
            </p>
            <button className="w-full bg-white text-primary py-4 rounded-2xl font-bold hover:bg-gray-100 transition-colors shadow-lg">
              Absen Sekarang
            </button>
          </div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
