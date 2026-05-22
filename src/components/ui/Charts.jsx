import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function RevenueChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="month" stroke="var(--text-muted)" />
        <YAxis stroke="var(--text-muted)" tickFormatter={(v) => `$${v / 1000}k`} />
        <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
        <Legend />
        <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" fill="url(#revGrad)" strokeWidth={2} />
        <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function AppointmentBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="day" stroke="var(--text-muted)" />
        <YAxis stroke="var(--text-muted)" />
        <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
        <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DiseasePieChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function HealthTrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="week" stroke="var(--text-muted)" />
        <YAxis stroke="var(--text-muted)" domain={[0, 100]} />
        <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
        <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function RiskBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis type="number" domain={[0, 100]} stroke="var(--text-muted)" />
        <YAxis type="category" dataKey="patient" width={100} stroke="var(--text-muted)" />
        <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
        <Bar dataKey="risk" fill="#ef4444" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
