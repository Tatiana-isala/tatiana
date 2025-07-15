'use client'
import { useEffect, useState } from 'react';
import {
  FaUsers, FaChalkboardTeacher, FaUserFriends, FaGraduationCap, 
  FaSchool, FaBook, FaMoneyBillWave, FaCalendarTimes,
  FaEye, FaArrowUp, FaArrowDown, FaEllipsisH
} from 'react-icons/fa';
import {
  getAllUsers,
  getParents,
  getAllStudents,
  getAllClassrooms,
  getAllCourses,
  getAllPayments,
  getEnseignantsWithDetails,
  getAbsenceStatistics
} from '@/lib/db';
import SyncManager from '@/components/SyncManager';

const HomePage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTeachers: 0,
    totalParents: 0,
    totalStudents: 0,
    totalClassrooms: 0,
    totalCourses: 0,
    totalRevenue: 0,
    recentPayments: [] as any[],
    absenceStats: {
      daily: [] as { date: string; count: number }[],
      monthly: [] as { month: string; count: number }[],
      byStudent: [] as { studentId: string; name: string; count: number }[]
    },
    monthlyTrend: 'up' as 'up' | 'down'
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          users,
          parents,
          students,
          classrooms,
          courses,
          payments,
          teachers,
          absenceStats
        ] = await Promise.all([
          getAllUsers(),
          getParents(),
          getAllStudents(),
          getAllClassrooms(),
          getAllCourses(),
          getAllPayments(),
          getEnseignantsWithDetails(),
          getAbsenceStatistics()
        ]);

        const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
        const recentPayments = payments
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);

        // Calcul de la tendance mensuelle (exemple simplifié)
        const monthlyTrend = Math.random() > 0.5 ? 'up' : 'down';

        setStats({
          totalUsers: users.length,
          totalTeachers: teachers.length,
          totalParents: parents.length,
          totalStudents: students.length,
          totalClassrooms: classrooms.length,
          totalCourses: courses.length,
          totalRevenue,
          recentPayments,
          absenceStats,
          monthlyTrend
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-2 bg-gray-50 min-h-screen">
      <SyncManager/>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Tableau de Bord</h1>
      
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Utilisateurs" 
          value={stats.totalUsers} 
          icon={<FaUsers className="text-blue-500 text-2xl" />}
          trend={stats.monthlyTrend}
          trendValue="12%"
        />
        <StatCard 
          title="Enseignants" 
          value={stats.totalTeachers} 
          icon={<FaChalkboardTeacher className="text-green-500 text-2xl" />}
        />
        <StatCard 
          title="Parents" 
          value={stats.totalParents} 
          icon={<FaUserFriends className="text-purple-500 text-2xl" />}
        />
        <StatCard 
          title="Élèves" 
          value={stats.totalStudents} 
          icon={<FaGraduationCap className="text-yellow-500 text-2xl" />}
        />
        <StatCard 
          title="Classes" 
          value={stats.totalClassrooms} 
          icon={<FaSchool className="text-red-500 text-2xl" />}
        />
        <StatCard 
          title="Cours" 
          value={stats.totalCourses} 
          icon={<FaBook className="text-indigo-500 text-2xl" />}
        />
        <StatCard 
          title="Revenu Total" 
          value={`$${stats.totalRevenue.toLocaleString()}`} 
          icon={<FaMoneyBillWave className="text-green-600 text-2xl" />}
          trend={stats.monthlyTrend}
          trendValue="8%"
        />
        <StatCard 
          title="Absences (30j)" 
          value={stats.absenceStats.daily.reduce((sum, day) => sum + day.count, 0)} 
          icon={<FaCalendarTimes className="text-orange-500 text-2xl" />}
        />
      </div>

      {/* Derniers paiements et statistiques */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Derniers paiements */}
        <div className="bg-white rounded-xl shadow p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FaMoneyBillWave className="mr-2 text-green-500" />
              Derniers Paiements
            </h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
              Voir tout <FaEllipsisH className="ml-1" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Élève</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classe</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-900">{payment.studentName}</div>
                          <div className="text-xs text-gray-500">{payment.matricule}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.classroomName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      CDF {payment.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${payment.paymentType === 'CASH' ? 'bg-blue-100 text-blue-800' : 
                          payment.paymentType === 'BOURSE' ? 'bg-purple-100 text-purple-800' : 
                          'bg-green-100 text-green-800'}`}>
                        {payment.paymentType}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Statistiques d'absences */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FaCalendarTimes className="mr-2 text-orange-500" />
              Statistiques d'Absences
            </h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm">
              <FaEye />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Ce mois-ci</h3>
              {/* <p className="text-2xl font-bold text-gray-800">
                {stats.absenceStats.monthly.length > 0 
                  ? stats.absenceStats.monthly[stats.absenceStats.monthly.length - 1].count 
                  : 0}
                <span className="text-sm ml-2 text-gray-500">absences</span>
              </p> */}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Top élèves absents</h3>
              <ul className="mt-2 space-y-2">
                {stats.absenceStats.byStudent.slice(0, 3).map((student) => (
                  <li key={student.studentId} className="flex justify-between">
                    <span className="text-gray-700">{student.name}</span>
                    <span className="font-medium">{student.count} absences</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant StatCard amélioré
const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend,
  trendValue 
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string;
}) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
          {icon}
        </div>
      </div>
      {trend && (
        <div className={`mt-4 flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
          {trendValue} ce mois
        </div>
      )}
    </div>
  );
};

export default HomePage;