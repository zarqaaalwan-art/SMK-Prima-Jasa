import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  Save,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function StudentAttendance() {
  const { profile } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('Semua Kelas');
  const [classes, setClasses] = useState<string[]>([]);

  useEffect(() => {
    fetchStudents();
    fetchTodayAttendance();
  }, []);

  const fetchStudents = async () => {
    const { data } = await supabase.from('students').select('*').order('name');
    if (data) {
      setStudents(data);
      const uniqueClasses = Array.from(new Set(data.map(s => s.class)));
      setClasses(['Semua Kelas', ...uniqueClasses]);
    }
    setLoading(false);
  };

  const fetchTodayAttendance = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('student_attendance')
      .select('student_id, status')
      .eq('date', today);

    if (data) {
      const attMap: Record<string, string> = {};
      data.forEach(item => {
        attMap[item.student_id] = item.status;
      });
      setAttendance(attMap);
    }
  };

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = async () => {
    setSaving(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const attendanceData = Object.entries(attendance).map(([studentId, status]) => ({
        student_id: studentId,
        teacher_id: profile?.id,
        date: today,
        status,
        timestamp: new Date().toISOString()
      }));

      // Upsert logic: delete today's first then insert
      await supabase.from('student_attendance').delete().eq('date', today).eq('teacher_id', profile?.id);
      const { error } = await supabase.from('student_attendance').insert(attendanceData);

      if (error) throw error;
      alert('Absensi siswa berhasil disimpan!');
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Gagal menyimpan absensi.');
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter(s => 
    (selectedClass === 'Semua Kelas' || s.class === selectedClass) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.nis.includes(search))
  );

  const statusOptions = [
    { id: 'present', label: 'Hadir', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'absent', label: 'Alpa', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'late', label: 'Terlambat', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'excused', label: 'Izin', icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Absensi Siswa</h2>
            <p className="text-gray-500">Tanggal: {format(new Date(), 'd MMMM yyyy', { locale: id })}</p>
          </div>
          <button
            onClick={saveAttendance}
            disabled={saving || Object.keys(attendance).length === 0}
            className="flex items-center gap-2 bg-primary hover:bg-accent text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-95"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Simpan Absensi
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari nama atau NIS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
            >
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-8 py-5 font-bold text-gray-400 uppercase tracking-wider text-xs">Siswa</th>
                <th className="px-8 py-5 font-bold text-gray-400 uppercase tracking-wider text-xs">NIS & Kelas</th>
                <th className="px-8 py-5 font-bold text-gray-400 uppercase tracking-wider text-xs text-center">Status Kehadiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="animate-spin text-primary" size={32} />
                      <p className="text-gray-500 font-medium">Memuat data siswa...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          {student.name.charAt(0)}
                        </div>
                        <p className="font-bold text-gray-900">{student.name}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-gray-700">{student.nis}</p>
                      <p className="text-xs text-gray-500">{student.class}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-center gap-2">
                        {statusOptions.map((opt) => {
                          const Icon = opt.icon;
                          const isActive = attendance[student.id] === opt.id;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => handleStatusChange(student.id, opt.id)}
                              className={cn(
                                "flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all min-w-[80px]",
                                isActive 
                                  ? `${opt.bg} border-current ${opt.color}` 
                                  : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
                              )}
                            >
                              <Icon size={20} />
                              <span className="text-[10px] font-bold uppercase">{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center">
                    <p className="text-gray-400 font-medium">Tidak ada data siswa ditemukan.</p>
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
