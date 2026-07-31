import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CarFront,
  ClipboardCheck,
  Bell,
  History,
  AlertTriangle,
  Wrench,
  Home,
  ShieldCheck,
  PlayCircle,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  fetchDriverDashboard,
  fetchAssignments,
  fetchServiceHistory,
  submitChecklist,
  startTrip,
  submitIssueReport,
} from './api';

const SIDEBAR_ITEMS = [
  { icon: CarFront, label: 'Assigned Vehicle', sectionId: 'assigned-vehicle' },
  { icon: ShieldCheck, label: 'Compliance Status', sectionId: 'compliance-status' },
  { icon: ClipboardCheck, label: 'Pre-Trip Checklist', sectionId: 'pre-trip-checklist-form' },
  { icon: Bell, label: 'Notifications', sectionId: 'notifications' },
  { icon: History, label: 'Assignment History', sectionId: 'assignment-history' },
  { icon: AlertTriangle, label: 'Report Vehicle Issue', sectionId: 'report-issue' },
  { icon: Wrench, label: 'Service History', sectionId: 'service-history' },
];

const initialChecklist = {
  tyres: false,
  brakes: false,
  lights: false,
  fuel: false,
  mirrors: false,
  horn: false,
};

const initialIssueForm = {
  issueType: '',
  description: '',
  priority: 'Medium',
  date: new Date().toISOString().slice(0, 10),
};

export default function DriverDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checklist, setChecklist] = useState(initialChecklist);
  const [checklistMessage, setChecklistMessage] = useState('');
  const [issueForm, setIssueForm] = useState(initialIssueForm);
  const [issueMessage, setIssueMessage] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isDashboardMenuOpen, setIsDashboardMenuOpen] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);
  const sectionRefs = useRef({});

  const loadAll = async () => {
    setLoading(true);
    setError('');

    try {
      const [dashboardRes, assignmentRes, serviceRes] = await Promise.all([
        fetchDriverDashboard(),
        fetchAssignments(),
        fetchServiceHistory(),
      ]);

      setDashboard(dashboardRes.data);
      setAssignments(assignmentRes.data || []);
      setServiceHistory(serviceRes.data || []);

      const currentChecklist = dashboardRes.data?.checklist || null;
      if (currentChecklist) {
        setChecklist({
          tyres: Boolean(currentChecklist.tyres),
          brakes: Boolean(currentChecklist.brakes),
          lights: Boolean(currentChecklist.lights),
          fuel: Boolean(currentChecklist.fuel),
          mirrors: Boolean(currentChecklist.mirrors),
          horn: Boolean(currentChecklist.horn),
        });
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load driver dashboard data right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const todayTasks = useMemo(() => {
    const tasks = [];
    if (dashboard?.assignment) {
      tasks.push('Confirm assigned vehicle details');
    }
    if (dashboard?.checklist?.status === 'Completed') {
      tasks.push('Checklist submitted and ready for trip');
    } else {
      tasks.push('Complete the pre-trip checklist');
    }
    tasks.push('Review latest notifications');
    return tasks;
  }, [dashboard]);

  const complianceLabel = dashboard?.complianceStatus || 'Pending';
  const checklistComplete = Object.values(checklist).every(Boolean);

  const handleChecklistChange = (key) => {
    setChecklist((current) => ({ ...current, [key]: !current[key] }));
  };

  const handleChecklistSubmit = async () => {
    setChecklistMessage('');

    try {
      await submitChecklist({ ...checklist, vehicleId: dashboard?.assignment?.vehicleId || 'VH-102' });
      setChecklistMessage('Checklist submitted successfully.');
      await loadAll();
    } catch (err) {
      setChecklistMessage(err?.response?.data?.message || 'Checklist submission failed.');
    }
  };

  const handleStartTrip = async () => {
    try {
      await startTrip();
      setChecklistMessage('Trip started successfully.');
      await loadAll();
    } catch (err) {
      setChecklistMessage(err?.response?.data?.message || 'Trip could not be started yet.');
    }
  };

  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    setIssueMessage('');

    try {
      await submitIssueReport(issueForm);
      setIssueMessage('Issue report saved successfully.');
      setIssueForm(initialIssueForm);
      await loadAll();
    } catch (err) {
      setIssueMessage(err?.response?.data?.message || 'Unable to save issue report.');
    }
  };

  const pageCardStyle = {
    background: '#1E293B',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '18px',
    padding: '18px',
    boxShadow: '0 10px 30px rgba(2, 6, 23, 0.38)',
  };

  const handleSidebarClick = (sectionId) => {
    if (sectionId === 'dashboard') {
      setIsDashboardMenuOpen((current) => !current);
      return;
    }

    const target = sectionRefs.current[sectionId];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    if (loading || error) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        root: null,
        threshold: [0.2, 0.45, 0.7],
        rootMargin: '-20% 0px -45% 0px',
      }
    );

    Object.values(sectionRefs.current).forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [loading, error]);

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A', color: '#F8FAFC', display: 'flex', overflow: 'hidden' }}>
      <aside style={{ width: '260px', background: '#111827', padding: '20px', position: 'fixed', left: 0, top: 0, bottom: 0, borderRight: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 0 0 1px rgba(255,255,255,0.03)' }}>
        <div style={{ fontSize: '24px', fontWeight: 800, marginBottom: '28px' }}>FleetGuard</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            type="button"
            onClick={() => handleSidebarClick('dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: activeSection === 'dashboard' ? '#2563EB' : hoveredItem === 'dashboard' ? 'rgba(59,130,246,0.22)' : 'transparent',
              color: '#F8FAFC',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 14px',
              textAlign: 'left',
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: activeSection === 'dashboard' ? '0 6px 18px rgba(37,99,235,0.35)' : 'none',
              fontWeight: activeSection === 'dashboard' ? 700 : 500,
            }}
            onMouseEnter={() => setHoveredItem('dashboard')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Home size={16} />
            <span style={{ fontSize: '14px', transition: 'transform 0.25s ease' }}>{isDashboardMenuOpen ? '▼' : '▶'}</span>
            <span>Dashboard</span>
          </button>

          <div
            style={{
              overflow: 'hidden',
              maxHeight: isDashboardMenuOpen ? '520px' : '0px',
              transition: 'max-height 0.25s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              paddingLeft: '12px',
            }}
          >
            {SIDEBAR_ITEMS.map(({ icon: Icon, label, sectionId }) => {
              const active = activeSection === sectionId;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleSidebarClick(sectionId)}
                  onMouseEnter={() => setHoveredItem(sectionId)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: active ? '#2563EB' : hoveredItem === sectionId ? 'rgba(59,130,246,0.22)' : 'transparent',
                    color: '#F8FAFC',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    textAlign: 'left',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: active ? '0 6px 18px rgba(37,99,235,0.35)' : 'none',
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  <Icon size={15} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </aside>

      <main style={{ marginLeft: '260px', width: 'calc(100% - 260px)', padding: '26px', overflowY: 'auto', scrollBehavior: 'smooth' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', padding: '8px 0' }}>
          <div>
            <div style={{ color: '#94A3B8', fontSize: '14px' }}>Driver Dashboard</div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, margin: '4px 0 0' }}>Vehicle Operations</h1>
          </div>
          <button type="button" onClick={() => navigate('/login')} style={{ background: 'transparent', color: '#F8FAFC', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 14px', display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer' }}>
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>

        {loading ? (
          <div style={pageCardStyle}>Loading driver data...</div>
        ) : error ? (
          <div style={{ ...pageCardStyle, color: '#FCA5A5' }}>{error}</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
            <div
              id="dashboard"
              ref={(node) => {
                sectionRefs.current.dashboard = node;
              }}
              style={{
                ...pageCardStyle,
                scrollMarginTop: '90px',
                border: activeSection === 'dashboard' ? '3px solid #3B82F6' : '1px solid rgba(255,255,255,0.06)',
                boxShadow: activeSection === 'dashboard'
                  ? '0 0 0 1px rgba(59,130,246,0.35), 0 0 20px rgba(59,130,246,0.32)'
                  : '0 10px 30px rgba(2, 6, 23, 0.38)',
                transition: 'border 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <div style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '10px' }}>Assigned Vehicle</div>
              <div style={{ fontSize: '18px', fontWeight: 700 }}>{dashboard?.assignment?.vehicleName || 'Truck 12A'}</div>
              <div style={{ color: '#94A3B8', marginTop: '6px' }}>{dashboard?.assignment?.vehicleNumber || 'DL-07-TR-1812'}</div>
              <div style={{ marginTop: '16px', color: '#F8FAFC' }}>Tracker: {dashboard?.assignment?.tracker || 'GPS Ready'}</div>
            </div>

            <div
              id="dashboard-tasks"
              ref={(node) => {
                sectionRefs.current['dashboard-tasks'] = node;
              }}
              style={{
                ...pageCardStyle,
                scrollMarginTop: '90px',
                border: activeSection === 'dashboard-tasks' ? '3px solid #3B82F6' : '1px solid rgba(255,255,255,0.06)',
                boxShadow: activeSection === 'dashboard-tasks'
                  ? '0 0 0 1px rgba(59,130,246,0.35), 0 0 20px rgba(59,130,246,0.32)'
                  : '0 10px 30px rgba(2, 6, 23, 0.38)',
                transition: 'border 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <div style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '10px' }}>Today's Tasks</div>
              <ul style={{ paddingLeft: '18px', color: '#F8FAFC', display: 'grid', gap: '8px' }}>
                {todayTasks.map((task) => <li key={task}>{task}</li>)}
              </ul>
            </div>

            <div
              id="compliance-status"
              ref={(node) => {
                sectionRefs.current['compliance-status'] = node;
              }}
              style={{
                ...pageCardStyle,
                scrollMarginTop: '90px',
                border: activeSection === 'compliance-status' ? '3px solid #3B82F6' : '1px solid rgba(255,255,255,0.06)',
                boxShadow: activeSection === 'compliance-status'
                  ? '0 0 0 1px rgba(59,130,246,0.35), 0 0 20px rgba(59,130,246,0.32)'
                  : '0 10px 30px rgba(2, 6, 23, 0.38)',
                transition: 'border 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <div style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '10px' }}>Compliance Summary</div>
              <div style={{ fontSize: '30px', fontWeight: 700 }}>{complianceLabel}</div>
              <div style={{ color: '#94A3B8', marginTop: '6px' }}>Insurance due: {dashboard?.assignment?.insuranceExpiry ? new Date(dashboard.assignment.insuranceExpiry).toLocaleDateString() : 'N/A'}</div>
            </div>

            <div
              id="pre-trip-checklist"
              ref={(node) => {
                sectionRefs.current['pre-trip-checklist'] = node;
              }}
              style={{
                ...pageCardStyle,
                scrollMarginTop: '90px',
                border: activeSection === 'pre-trip-checklist' ? '3px solid #3B82F6' : '1px solid rgba(255,255,255,0.06)',
                boxShadow: activeSection === 'pre-trip-checklist'
                  ? '0 0 0 1px rgba(59,130,246,0.35), 0 0 20px rgba(59,130,246,0.32)'
                  : '0 10px 30px rgba(2, 6, 23, 0.38)',
                transition: 'border 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <div style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '10px' }}>Pending Checklist</div>
              <div style={{ fontSize: '30px', fontWeight: 700 }}>{dashboard?.pendingChecklistCount ?? 6}</div>
              <div style={{ color: '#94A3B8', marginTop: '6px' }}>Checklist status: {dashboard?.checklist?.status || 'Pending'}</div>
            </div>

            <div
              id="notifications"
              ref={(node) => {
                sectionRefs.current.notifications = node;
              }}
              style={{
                ...pageCardStyle,
                gridColumn: '1 / -1',
                scrollMarginTop: '90px',
                border: activeSection === 'notifications' ? '3px solid #3B82F6' : '1px solid rgba(255,255,255,0.06)',
                boxShadow: activeSection === 'notifications'
                  ? '0 0 0 1px rgba(59,130,246,0.35), 0 0 20px rgba(59,130,246,0.32)'
                  : '0 10px 30px rgba(2, 6, 23, 0.38)',
                transition: 'border 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <div style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '10px' }}>Recent Notifications</div>
              <div style={{ display: 'grid', gap: '10px' }}>
                {(dashboard?.notifications || []).map((item) => (
                  <div key={item._id || item.id} style={{ background: '#243244', borderRadius: '12px', padding: '12px' }}>
                    <div style={{ fontWeight: 700 }}>{item.title}</div>
                    <div style={{ color: '#94A3B8', marginTop: '4px' }}>{item.message}</div>
                  </div>
                ))}
              </div>
            </div>

            <div
              id="pre-trip-checklist-form"
              ref={(node) => {
                sectionRefs.current['pre-trip-checklist-form'] = node;
              }}
              style={{
                ...pageCardStyle,
                gridColumn: '1 / -1',
                scrollMarginTop: '90px',
                border: activeSection === 'pre-trip-checklist-form' ? '3px solid #3B82F6' : '1px solid rgba(255,255,255,0.06)',
                boxShadow: activeSection === 'pre-trip-checklist-form'
                  ? '0 0 0 1px rgba(59,130,246,0.35), 0 0 20px rgba(59,130,246,0.32)'
                  : '0 10px 30px rgba(2, 6, 23, 0.38)',
                transition: 'border 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <ClipboardCheck />
                <h2 style={{ fontSize: '18px' }}>Pre-Trip Checklist</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                {Object.entries(checklist).map(([key, value]) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#243244', padding: '12px', borderRadius: '10px' }}>
                    <input type="checkbox" checked={value} onChange={() => handleChecklistChange(key)} />
                    <span style={{ textTransform: 'capitalize' }}>{key}</span>
                  </label>
                ))}
              </div>
              <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button type="button" onClick={handleChecklistSubmit} style={{ background: '#3B82F6', color: '#F8FAFC', border: 'none', borderRadius: '10px', padding: '12px 18px', fontWeight: 700, cursor: 'pointer' }}>Submit Checklist</button>
                <button type="button" onClick={handleStartTrip} disabled={!checklistComplete} style={{ background: checklistComplete ? '#22C55E' : '#64748B', color: '#F8FAFC', border: 'none', borderRadius: '10px', padding: '12px 18px', fontWeight: 700, cursor: checklistComplete ? 'pointer' : 'not-allowed' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><PlayCircle size={16} /> Start Trip</span>
                </button>
              </div>
              {checklistMessage && <div style={{ marginTop: '12px', color: checklistMessage.includes('success') ? '#22C55E' : '#FCA5A5' }}>{checklistMessage}</div>}
            </div>

            <div
              id="assignment-history"
              ref={(node) => {
                sectionRefs.current['assignment-history'] = node;
              }}
              style={{
                ...pageCardStyle,
                gridColumn: '1 / -1',
                scrollMarginTop: '90px',
                border: activeSection === 'assignment-history' ? '3px solid #3B82F6' : '1px solid rgba(255,255,255,0.06)',
                boxShadow: activeSection === 'assignment-history'
                  ? '0 0 0 1px rgba(59,130,246,0.35), 0 0 20px rgba(59,130,246,0.32)'
                  : '0 10px 30px rgba(2, 6, 23, 0.38)',
                transition: 'border 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <History />
                <h2 style={{ fontSize: '18px' }}>Assignment History</h2>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: '#F8FAFC' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '8px 0', color: '#94A3B8' }}>Vehicle</th>
                    <th style={{ textAlign: 'left', padding: '8px 0', color: '#94A3B8' }}>Assigned Date</th>
                    <th style={{ textAlign: 'left', padding: '8px 0', color: '#94A3B8' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((entry) => (
                    <tr key={entry._id || entry.vehicleId}>
                      <td style={{ padding: '10px 0' }}>{entry.vehicleNumber}</td>
                      <td style={{ padding: '10px 0' }}>{new Date(entry.assignedDate).toLocaleDateString()}</td>
                      <td style={{ padding: '10px 0' }}>{entry.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              id="report-issue"
              ref={(node) => {
                sectionRefs.current['report-issue'] = node;
              }}
              style={{
                ...pageCardStyle,
                scrollMarginTop: '90px',
                border: activeSection === 'report-issue' ? '3px solid #3B82F6' : '1px solid rgba(255,255,255,0.06)',
                boxShadow: activeSection === 'report-issue'
                  ? '0 0 0 1px rgba(59,130,246,0.35), 0 0 20px rgba(59,130,246,0.32)'
                  : '0 10px 30px rgba(2, 6, 23, 0.38)',
                transition: 'border 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <AlertTriangle />
                <h2 style={{ fontSize: '18px' }}>Report Vehicle Issue</h2>
              </div>
              <form onSubmit={handleIssueSubmit} style={{ display: 'grid', gap: '12px' }}>
                <input value={issueForm.issueType} onChange={(e) => setIssueForm({ ...issueForm, issueType: e.target.value })} placeholder="Issue Type" style={{ background: '#0F172A', color: '#F8FAFC', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px' }} required />
                <textarea value={issueForm.description} onChange={(e) => setIssueForm({ ...issueForm, description: e.target.value })} placeholder="Description" style={{ background: '#0F172A', color: '#F8FAFC', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px', minHeight: '110px' }} required />
                <select value={issueForm.priority} onChange={(e) => setIssueForm({ ...issueForm, priority: e.target.value })} style={{ background: '#0F172A', color: '#F8FAFC', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px' }}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
                <input type="date" value={issueForm.date} onChange={(e) => setIssueForm({ ...issueForm, date: e.target.value })} style={{ background: '#0F172A', color: '#F8FAFC', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px' }} required />
                <button type="submit" style={{ background: '#EF4444', color: '#F8FAFC', border: 'none', borderRadius: '10px', padding: '12px 16px', fontWeight: 700, cursor: 'pointer' }}>Submit Report</button>
              </form>
              {issueMessage && <div style={{ marginTop: '12px', color: issueMessage.includes('success') ? '#22C55E' : '#FCA5A5' }}>{issueMessage}</div>}
            </div>

            <div
              id="service-history"
              ref={(node) => {
                sectionRefs.current['service-history'] = node;
              }}
              style={{
                ...pageCardStyle,
                scrollMarginTop: '90px',
                border: activeSection === 'service-history' ? '3px solid #3B82F6' : '1px solid rgba(255,255,255,0.06)',
                boxShadow: activeSection === 'service-history'
                  ? '0 0 0 1px rgba(59,130,246,0.35), 0 0 20px rgba(59,130,246,0.32)'
                  : '0 10px 30px rgba(2, 6, 23, 0.38)',
                transition: 'border 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <Wrench />
                <h2 style={{ fontSize: '18px' }}>Service History</h2>
              </div>
              <div style={{ display: 'grid', gap: '10px' }}>
                {serviceHistory.map((entry) => (
                  <div key={entry._id || entry.performedDate} style={{ background: '#243244', borderRadius: '12px', padding: '12px' }}>
                    <div style={{ fontWeight: 700 }}>{entry.serviceType}</div>
                    <div style={{ color: '#94A3B8', marginTop: '4px' }}>{new Date(entry.performedDate).toLocaleDateString()} • {entry.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
