// 'use client'
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { Absence } from '@/lib/db';

// export function DailyAbsenceChart({ data }: { data: { date: string; count: number }[] }) {
//     return (
//         <div className="h-80">
//             <h3 className="text-center font-medium mb-2">Absences par jour</h3>
//             <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={data}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="date" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="count" fill="#8884d8" name="Nombre d'absences" />
//                 </BarChart>
//             </ResponsiveContainer>
//         </div>
//     );
// }

// export function MonthlyAbsenceChart({ data }: { data: { month: string; count: number }[] }) {
//     return (
//         <div className="h-80">
//             <h3 className="text-center font-medium mb-2">Absences par mois</h3>
//             <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={data}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="month" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="count" fill="#82ca9d" name="Nombre d'absences" />
//                 </BarChart>
//             </ResponsiveContainer>
//         </div>
//     );
// }

// export function StudentAbsenceChart({ data }: { data: { name: string; count: number }[] }) {
//     return (
//         <div className="h-96">
//             <h3 className="text-center font-medium mb-2">Absences par élève</h3>
//             <ResponsiveContainer width="100%" height="100%">
//                 <BarChart 
//                     data={data.slice(0, 10)} // Limite aux 10 premiers
//                     layout="vertical"
//                     margin={{ left: 100 }}
//                 >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis type="number" />
//                     <YAxis type="category" dataKey="name" width={90} />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="count" fill="#ffc658" name="Jours d'absence" />
//                 </BarChart>
//             </ResponsiveContainer>
//         </div>
//     );
// }
'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Absence } from '@/lib/db';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export function DailyAbsenceChart({ data }: { data: { date: string; count: number }[] }) {
    return (
        <div className="h-80 bg-white rounded-lg shadow p-4">
            <h3 className="text-center font-medium mb-4 text-lg">Absences par jour</h3>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        label={{ value: 'Date', position: 'insideBottomRight', offset: -5 }}
                    />
                    <YAxis 
                        label={{ value: 'Nombre', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                        formatter={(value) => [`${value} absences`, 'Nombre']}
                        labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Bar 
                        dataKey="count" 
                        fill="#8884d8" 
                        name="Absences" 
                        radius={[4, 4, 0, 0]}
                        animationDuration={1500}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export function MonthlyAbsenceChart({ data }: { data: { month: string; count: number }[] }) {
    return (
        <div className="h-80 bg-white rounded-lg shadow p-4">
            <h3 className="text-center font-medium mb-4 text-lg">Absences par mois</h3>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 12 }}
                        label={{ value: 'Mois', position: 'insideBottomRight', offset: -5 }}
                    />
                    <YAxis 
                        label={{ value: 'Nombre', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                        formatter={(value) => [`${value} absences`, 'Nombre']}
                        labelFormatter={(label) => `Mois: ${label}`}
                    />
                    <Legend />
                    <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                        name="Absences"
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        animationDuration={1500}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export function StudentAbsenceChart({ data }: { data: { name: string; count: number }[] }) {
    return (
        <div className="h-96 bg-white rounded-lg shadow p-4">
            <h3 className="text-center font-medium mb-4 text-lg">Top 10 élèves absents</h3>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart 
                    data={data.slice(0, 10).sort((a, b) => b.count - a.count)}
                    layout="vertical"
                    margin={{ left: 100, right: 20 }}
                >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} horizontal={false} />
                    <XAxis 
                        type="number" 
                        label={{ value: "Jours d'absence", position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                        type="category" 
                        dataKey="name" 
                        width={120} 
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                        formatter={(value) => [`${value} jours`, 'Absences']}
                        labelFormatter={(label) => `Élève: ${label}`}
                    />
                    <Bar 
                        dataKey="count" 
                        fill="#ffc658" 
                        name="Jours d'absence" 
                        radius={[0, 4, 4, 0]}
                        animationDuration={1500}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export function ReasonAbsenceChart({ data }: { data: { reason: string; count: number }[] }) {
    return (
        <div className="h-80 bg-white rounded-lg shadow p-4">
            <h3 className="text-center font-medium mb-4 text-lg">Répartition par motif</h3>
            <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="reason"
                        label={({ name, percent = 0 }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                        formatter={(value, name, props) => [
                            `${value} absences (${(props.payload.percent * 100).toFixed(1)}%)`,
                            props.payload.reason
                        ]}
                    />
                    <Legend 
                        layout="vertical" 
                        verticalAlign="middle" 
                        align="right"
                        formatter={(value, entry, index) => (
                            <span className="text-sm">{value}</span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export function AbsenceTrendChart({ data }: { data: { period: string; count: number }[] }) {
    return (
        <div className="h-80 bg-white rounded-lg shadow p-4">
            <h3 className="text-center font-medium mb-4 text-lg">Évolution des absences</h3>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis 
                        dataKey="period" 
                        tick={{ fontSize: 12 }}
                        label={{ value: 'Période', position: 'insideBottomRight', offset: -5 }}
                    />
                    <YAxis 
                        label={{ value: 'Nombre', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                        formatter={(value) => [`${value} absences`, 'Nombre']}
                        labelFormatter={(label) => `Période: ${label}`}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#0088FE" 
                        strokeWidth={2}
                        name="Absences"
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        animationDuration={1500}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}