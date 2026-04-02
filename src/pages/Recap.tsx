import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  ClipboardList, 
  Download, 
  Filter, 
  Calendar,
  Users,
  GraduationCap,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useAuth } from '../contexts/AuthContext';

export default function Recap() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'employee' | 'student'>('employee');
  const [employeeRecap, setEmployeeRecap] = useState<any[]>([]);
  const [studentRecap, setStudentRecap] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: format(new Date(), 'yyyy-MM-01'),
    end: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    if (profile?.role === 'guru') {
      setActiveTab('student');
    }
    fetchRecap();
  }, [activeTab, dateRange]);

  const fetchRecap = async () => {
    setLoading(true);
    try {
      if (activeTab === 'employee') {
        const { data } = await supabase
          .from('employee_attendance')
          .select('*, profiles(full_name, role)')
          .gte('date', dateRange.start)
          .lte('date', dateRange.end)
          .order('date', { ascending: false });
        if (data) setEmployeeRecap(data);
      } else {
        const { data } = await supabase
          .from('student_attendance')
          .select('*, students(name, class), profiles(full_name)')
          .gte('date', dateRange.start)
          .lte('date', dateRange.end)
          .order('date', { ascending: false });
        if (data) setStudentRecap(data);
      }
    } catch (error) {
      console.error('Error fetching recap:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'employee', label: 'Absensi Karyawan', icon: Users, roles: ['admin'] },
    { id: 'student', label: 'Absensi Siswa', icon: GraduationCap, roles: ['admin', 'guru'] },
  ].filter(tab => profile && tab.roles.includes(profile.role));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-emerald-100 text-emerald-700';
      case 'late': return 'bg-orange-100 text-orange-700';
      case 'excused': return 'bg-blue-100 text-blue-700';
      case 'absent': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present': return 'Hadir';
      case 'late': return 'Terlambat';
      case 'excused': return 'Izin';
      case 'absent': return 'Alpa';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters & Tabs */}
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex p-1.5 bg-gray-100 rounded-2xl w-fit">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all",
                    activeTab === tab.id 
                      ? "bg-white text-primary shadow-sm" 
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl">
              <Calendar size={18} className="text-gray-400" />
              <input 
                type="date" 
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="bg-transparent outline-none text-sm font-bold text-gray-700"
              />
              <span className="text-gray-400">s/d</span>
              <input 
                type="date" 
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="bg-transparent outline-none text-sm font-bold text-gray-700"
              />
            </div>
            <button className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95">
              <Download size={18} />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Recap Table */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-8 py-5 font-bold text-gray-400 uppercase tracking-wider text-xs">Tanggal</th>
                <th className="px-8 py-5 font-bold text-gray-400 uppercase tracking-wider text-xs">
                  {activeTab === 'employee' ? 'Karyawan' : 'Siswa'}
                </th>
                <th className="px-8 py-5 font-bold text-gray-400 uppercase tracking-wider text-xs">
                  {activeTab === 'employee' ? 'Role' : 'Kelas'}
                </th>
                <th className="px-8 py-5 font-bold text-gray-400 uppercase tracking-wider text-xs">Status</th>
                <th className="px-8 py-5 font-bold text-gray-400 uppercase tracking-wider text-xs">
                  {activeTab === 'employee' ? 'Waktu' : 'Guru Pengabsen'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <Loader2 className="animate-spin text-primary mx-auto mb-4" size={32} />
                    <p className="text-gray-500 font-medium">Memuat rekapitulasi...</p>
                  </td>
                </tr>
              ) : (activeTab === 'employee' ? employeeRecap : studentRecap).length > 0 ? (
                (activeTab === 'employee' ? employeeRecap : studentRecap).map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5 font-bold text-gray-700">
                      {format(new Date(item.date), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-bold text-gray-900">
                        {activeTab === 'employee' ? item.profiles?.full_name : item.students?.name}
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold uppercase">
                        {activeTab === 'employee' ? item.profiles?.role : item.students?.class}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider",
                        getStatusColor(item.status)
                      )}>
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-500 font-medium">
                      {activeTab === 'employee' 
                        ? format(new Date(item.timestamp), 'HH:mm') + ' WIB'
                        : item.profiles?.full_name
                      }
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <p className="text-gray-400 font-medium">Tidak ada data absensi pada periode ini.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
