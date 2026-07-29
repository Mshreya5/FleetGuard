import { AlertTriangle, Shield, Wrench, Users, Server } from 'lucide-react';

export const CATEGORIES = ['All', 'Compliance', 'Maintenance', 'Driver', 'Security', 'System'];
export const PRIORITIES = ['All', 'Critical', 'High', 'Medium', 'Low'];

export const CATEGORY_META = {
  Compliance:  { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  icon: Shield },
  Maintenance: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', icon: Wrench },
  Driver:      { color: '#22c55e', bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.3)',  icon: Users },
  Security:    { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  icon: AlertTriangle },
  System:      { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)', icon: Server },
};

export const PRIORITY_COLOR = {
  Critical: '#ef4444',
  High:     '#f59e0b',
  Medium:   '#3b82f6',
  Low:      '#94a3b8',
};

let _id = 100;
export const genId = () => `N-${++_id}`;

export const INITIAL_NOTIFICATIONS = [
  { id: 'N-001', title: 'Insurance expires in 7 days',       category: 'Compliance',  priority: 'Critical', time: '10 min ago',  read: false, detail: 'Vehicle TN-01-AB-1234 insurance policy expires on 05 Aug 2026. Renew immediately.' },
  { id: 'N-002', title: 'Vehicle service completed',         category: 'Maintenance', priority: 'Low',      time: '1 hour ago',  read: false, detail: 'Scheduled service for TN-02-CD-5678 completed by ServiceTech at 09:30 AM.' },
  { id: 'N-003', title: 'Failed login attempt detected',     category: 'Security',    priority: 'High',     time: 'Today',       read: false, detail: 'Multiple failed login attempts from IP 192.168.1.99. Account temporarily locked.' },
  { id: 'N-004', title: 'Driver assigned to Route C',        category: 'Driver',      priority: 'Medium',   time: '2 hours ago', read: true,  detail: 'Driver001 has been assigned to Route C starting 29 Jul 2026.' },
  { id: 'N-005', title: 'Pollution certificate expiring',    category: 'Compliance',  priority: 'High',     time: '3 hours ago', read: false, detail: 'PUC certificate for TN-03-EF-9012 expires in 3 days.' },
  { id: 'N-006', title: 'Pre-trip checklist submitted',      category: 'Driver',      priority: 'Low',      time: '4 hours ago', read: true,  detail: 'Driver002 submitted pre-trip checklist for morning shift.' },
  { id: 'N-007', title: 'Database backup completed',         category: 'System',      priority: 'Low',      time: 'Yesterday',   read: true,  detail: 'Nightly database backup completed successfully at 02:00 AM.' },
  { id: 'N-008', title: 'Inspection overdue — 3 vehicles',   category: 'Compliance',  priority: 'Critical', time: 'Yesterday',   read: false, detail: 'Vehicles TN-04, TN-05, TN-06 have missed their scheduled inspection.' },
  { id: 'N-009', title: 'Password changed by Admin',         category: 'Security',    priority: 'Medium',   time: '2 days ago',  read: true,  detail: 'Admin account password was changed from IP 192.168.1.10.' },
  { id: 'N-010', title: 'Vehicle service due in 2 days',     category: 'Maintenance', priority: 'High',     time: '2 days ago',  read: false, detail: 'TN-07-GH-3456 is due for oil change and tyre rotation.' },
  { id: 'N-011', title: 'Document uploaded — Insurance PDF', category: 'Compliance',  priority: 'Low',      time: '3 days ago',  read: true,  detail: 'Insurance_2026.pdf uploaded by Admin for vehicle TN-01-AB-1234.' },
  { id: 'N-012', title: 'Server maintenance scheduled',      category: 'System',      priority: 'Medium',   time: '3 days ago',  read: true,  detail: 'Planned server maintenance on 01 Aug 2026 from 01:00–03:00 AM.' },
  { id: 'N-013', title: 'Trip completed — Route A',          category: 'Driver',      priority: 'Low',      time: '4 days ago',  read: true,  detail: 'Driver001 completed Route A trip. Distance: 142 km. Duration: 3h 20m.' },
  { id: 'N-014', title: 'Admin override action logged',      category: 'Security',    priority: 'High',     time: '4 days ago',  read: false, detail: 'Admin created a compliance override for emergency dispatch.' },
  { id: 'N-015', title: 'New vehicle registered',            category: 'System',      priority: 'Medium',   time: '5 days ago',  read: true,  detail: 'Vehicle TN-01-AB-1234 registered by Fleet Manager Kiran Shree.' },
];

export const ACTION_TEMPLATES = {
  'Vehicle Registered':  (meta) => ({ title: `New vehicle registered — ${meta}`,        category: 'System',      priority: 'Medium'  }),
  'Vehicle Deleted':     (meta) => ({ title: `Vehicle removed — ${meta}`,               category: 'System',      priority: 'High'    }),
  'Driver Assigned':     (meta) => ({ title: `Driver assigned — ${meta}`,               category: 'Driver',      priority: 'Medium'  }),
  'Checklist Submitted': (meta) => ({ title: `Pre-trip checklist submitted by ${meta}`,  category: 'Driver',      priority: 'Low'     }),
  'Service Logged':      (meta) => ({ title: `Service logged for ${meta}`,              category: 'Maintenance', priority: 'Low'     }),
  'Document Uploaded':   (meta) => ({ title: `Document uploaded — ${meta}`,             category: 'Compliance',  priority: 'Low'     }),
  'Compliance Expired':  (meta) => ({ title: `Compliance expired — ${meta}`,            category: 'Compliance',  priority: 'Critical'}),
};
