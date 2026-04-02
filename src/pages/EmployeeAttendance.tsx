import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  UserCheck, 
  History,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '../lib/utils';

export default function EmployeeAttendance() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(false);

  useEffect(() => {
    if (profile) {
      fetchHistory();
      checkTodayAttendance();
    }
  }, [profile]);

  const checkTodayAttendance = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('employee_attendance')
      .select('*')
      .eq('user_id', profile?.id)
      .eq('date', today)
      .single();

    if (data) {
      setAlreadyCheckedIn(true);
      setStatus(data.status);
    }
  };

  const fetchHistory = async () => {
    const { data } = await supabase
      .from('employee_attendance')
      .select('*')
      .eq('user_id', profile?.id)
      .order('date', { ascending: false })
      .limit(5);

    if (data) setHistory(data);
  };

  const handleAttendance = async (selectedStatus: string) => {
    if (alreadyCheckedIn) return;
    
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const { error } = await supabase.from('employee_attendance').insert({
        user_id: profile?.id,
        date: today,
        status: selectedStatus,
        timestamp: new Date().toISOString()
      });

      if (error) throw error;
      
      setAlreadyCheckedIn(true);
      setStatus(selectedStatus);
      fetchHistory();
    } catch (error) {
      console.error('Error recording attendance:', error);
      alert('Gagal mencatat absensi. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { id: 'present', label: 'Hadir', icon: CheckCircle2, color: 'bg-emerald-500', hover: 'hover:bg-emerald-600' },
    { id: 'late', label: 'Terlambat', icon: Clock, color: 'bg-orange-500', hover: 'hover:bg-orange-600' },
    { id: 'excused', label: 'Izin', icon: AlertCircle, color: 'bg-blue-500', hover: 'hover:bg-blue-600' },
    { id: 'absent', label: 'Alpa', icon: AlertCircle, color: 'bg-red-500', hover: 'hover:bg-red-600' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Attendance Card */}
        <div className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
              <UserCheck size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Absensi Mandiri</h2>
              <p className="text-gray-500">Silakan pilih status kehadiran Anda hari ini.</p>
            </div>
          </div>

          {alreadyCheckedIn ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl text-center"
            >
              <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-bold text-emerald-900 mb-2">Sudah Absen!</h3>
              <p className="text-emerald-700 font-medium mb-6">
                Anda telah melakukan absensi hari ini dengan status:
              </p>
              <span className="inline-block px-6 py-2 bg-emerald-500 text-white rounded-full font-bold uppercase tracking-wider">
                {statusOptions.find(o => o.id === status)?.label}
              </span>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {statusOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleAttendance(option.id)}
                    disabled={loading}
                    className={cn(
                      "flex flex-col items-center gap-4 p-6 rounded-3xl border-2 border-transparent transition-all group",
                      option.color,
                      "text-white shadow-lg shadow-gray-200",
                      option.hover,
                      "active:scale-95 disabled:opacity-50"
                    )}
                  >
                    <Icon size={32} className="group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-lg">{option.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Info & History */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <History size={20} className="text-primary" />
                Riwayat Terakhir
              </h3>
              <Calendar size={20} className="text-gray-400" />
            </div>
            <div className="space-y-4">
              {history.length > 0 ? (
                history.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div>
                      <p className="font-bold text-gray-900">
                        {format(new Date(item.date), 'EEEE, d MMM', { locale: id })}
                      </p>
                      <p className="text-xs text-gray-500">
                        Pukul {format(new Date(item.timestamp), 'HH:mm')} WIB
                      </p>
                    </div>
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider",
                      item.status === 'present' ? "bg-emerald-100 text-emerald-700" :
                      item.status === 'late' ? "bg-orange-100 text-orange-700" :
                      "bg-blue-100 text-blue-700"
                    )}>
                      {statusOptions.find(o => o.id === item.status)?.label}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-400 font-medium">Belum ada riwayat absensi.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-secondary p-8 rounded-[32px] text-white shadow-xl shadow-secondary/20">
            <h4 className="font-bold text-lg mb-2">Catatan Penting</h4>
            <ul className="space-y-3 text-white/80 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 shrink-0"></div>
                Absen masuk dilakukan sebelum pukul 07:30 WIB.
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 shrink-0"></div>
                Keterlambatan lebih dari 15 menit wajib melapor ke piket.
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 shrink-0"></div>
                Data absensi akan terekam secara otomatis ke sistem pusat.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
