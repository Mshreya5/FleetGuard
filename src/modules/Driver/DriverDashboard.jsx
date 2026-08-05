import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CarFront,
  ClipboardCheck,
  Bell,
  History,
  AlertTriangle,
  Wrench,
  ShieldCheck,
  PlayCircle,
  Search,
} from 'lucide-react';
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

const pageCardStyle = {
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '10px',
  padding: '20px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
  color: '#f1f5f9',
};

export default function DriverDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checklist, setChecklist] = useState(initialChecklist);
  const [checklistMessage, setChecklistMessage] = useState('');
  const [issueForm, setIssueForm] = useState(initialIssueForm);
  const [issueMessage, setIssueMessage] = useState('');
  const [activeSection, setActiveSection] = useState('assigned-vehicle');
  const [searchTerm, setSearchTerm] = useState('');
  const sectionRefs = useRef({});

  const loadAll = async () => {
    setLoading(true);
    setError('');

    try {
      const [dashboardRes, assignmentRes, serviceRes] = await Promise.allSettled([
        fetchDriverDashboard(),
        fetchAssignments(),
        fetchServiceHistory(),
      ]);

      if (dashboardRes.status === 'fulfilled' && dashboardRes.value?.data) {
        setDashboard(dashboardRes.value.data);
        const currentChecklist = dashboardRes.value.data?.checklist || null;
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
      }

      if (assignmentRes.status === 'fulfilled' && assignmentRes.value?.data) {
        const assignList = Array.isArray(assignmentRes.value.data) ? assignmentRes.value.data : (assignmentRes.value.data.assignments || []);
        setAssignments(assignList);
      } else {
        setAssignments([]);
      }

      if (serviceRes.status === 'fulfilled' && serviceRes.value?.data) {
        const sList = Array.isArray(serviceRes.value.data) ? serviceRes.value.data : (serviceRes.value.data.serviceHistory || []);
        setServiceHistory(sList);
      } else {
        setServiceHistory([]);
      }
    } catch (err) {
      setError('Unable to load driver dashboard data right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const checklistComplete = useMemo(
    () => Object.values(checklist).every(Boolean),
    [checklist]
  );

  const todayTasks = useMemo(() => {
    const defaultTasks = [
      'Perform mandatory morning pre-trip inspection',
      'Verify valid vehicle insurance and PUC compliance',
      'Log trip odometer and fuel readings',
    ];
    return dashboard?.todayTasks?.length ? dashboard.todayTasks : defaultTasks;
  }, [dashboard]);

  const complianceLabel = useMemo(() => {
    if (dashboard?.assignment?.complianceStatus) return dashboard.assignment.complianceStatus;
    if (dashboard?.complianceStatus) return dashboard.complianceStatus;
    return 'Compliant';
  }, [dashboard]);

  const handleChecklistChange = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChecklistSubmit = async () => {
    try {
      await submitChecklist(checklist);
      setChecklistMessage('Pre-trip checklist saved successfully to MongoDB.');
      loadAll();
    } catch (err) {
      setChecklistMessage(err?.response?.data?.message || 'Failed to submit checklist.');
    }
  };

  const handleStartTrip = async () => {
    try {
      await startTrip();
      setChecklistMessage('Trip started successfully! Drive safely.');
      loadAll();
    } catch (err) {
      setChecklistMessage(err?.response?.data?.message || 'Unable to start trip.');
    }
  };

  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitIssueReport(issueForm);
      setIssueMessage('Vehicle issue report submitted successfully.');
      setIssueForm(initialIssueForm);
      loadAll();
    } catch (err) {
      setIssueMessage(err?.response?.data?.message || 'Failed to report vehicle issue.');
    }
  };

  const handleSidebarClick = (sectionId) => {
    setActiveSection(sectionId);
    const target = sectionRefs.current[sectionId];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f1f5f9', display: 'flex' }}>
      {/* Standardized Master Sidebar */}
      <aside
        style={{
          width: '240px',
          backgroundColor: '#1e293b',
          borderRight: '1px solid #334155',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 110,
          paddingTop: '16px'
        }}
      >
        <div>
          <div style={{ padding: '0 20px 20px 20px', borderBottom: '1px solid #334155' }}>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#3b82f6' }}>
              FleetGuard
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              DRIVER PORTAL
            </div>
          </div>

          <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {SIDEBAR_ITEMS.map(({ icon: Icon, label, sectionId }) => {
              const active = activeSection === sectionId;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleSidebarClick(sectionId)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: active ? '#3b82f6' : 'transparent',
                    color: active ? '#ffffff' : '#f1f5f9',
                    fontSize: '13px',
                    fontWeight: active ? '700' : '500',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div style={{ flex: 1, marginLeft: '240px', display: 'flex', flexDirection: 'column', minHeight: '100vh', width: 'calc(100% - 240px)' }}>
        {/* Standardized Master Top Navbar */}
        <header style={{
          minHeight: '64px',
          backgroundColor: '#1e293b',
          borderBottom: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '18px', fontWeight: '800', color: '#3b82f6', letterSpacing: '0.5px' }}>
              FleetGuard
            </span>
            <span style={{ color: '#334155' }}>|</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#f1f5f9' }}>
              Driver
            </span>
          </div>

          <div style={{ flex: '1 1 200px', maxWidth: '360px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search vehicle, tasks, service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '20px',
                padding: '8px 16px 8px 36px',
                color: '#f1f5f9',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <Search
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '14px'
            }}>
              DR
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main style={{ flex: 1, padding: '24px', backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {loading ? (
            <div style={pageCardStyle}>Loading driver data...</div>
          ) : error ? (
            <div style={{ ...pageCardStyle, color: '#ef4444' }}>{error}</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
              <div
                id="assigned-vehicle"
                ref={(node) => { sectionRefs.current['assigned-vehicle'] = node; }}
                style={pageCardStyle}
              >
                <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>Assigned Vehicle</div>
                <div style={{ fontSize: '20px', fontWeight: 700 }}>
                  {dashboard?.assignment ? (dashboard.assignment.vehicleName || `${dashboard.assignment.brand || ''} ${dashboard.assignment.model || ''}`.trim() || dashboard.assignment.registrationNumber) : 'No vehicle assigned.'}
                </div>
                {dashboard?.assignment && (
                  <div style={{ color: '#3b82f6', marginTop: '6px', fontWeight: '700' }}>
                    {dashboard.assignment.vehicleNumber || dashboard.assignment.registrationNumber}
                  </div>
                )}
                <div style={{ marginTop: '14px', color: '#94a3b8', fontSize: '13px' }}>
                  {dashboard?.assignment ? `Tracker: ${dashboard.assignment.tracker || 'GPS Active'}` : 'No active assignment'}
                </div>
              </div>

              <div
                id="dashboard-tasks"
                ref={(node) => { sectionRefs.current['dashboard-tasks'] = node; }}
                style={pageCardStyle}
              >
                <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>Today's Tasks</div>
                <ul style={{ paddingLeft: '18px', color: '#f1f5f9', display: 'grid', gap: '6px', margin: 0, fontSize: '13px' }}>
                  {todayTasks.map((task) => <li key={task}>{task}</li>)}
                </ul>
              </div>

              <div
                id="compliance-status"
                ref={(node) => { sectionRefs.current['compliance-status'] = node; }}
                style={pageCardStyle}
              >
                <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>Compliance Summary</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: complianceLabel === 'Expired' ? '#ef4444' : '#22c55e' }}>{complianceLabel}</div>
                <div style={{ color: '#94a3b8', marginTop: '6px', fontSize: '13px' }}>Insurance due: {dashboard?.assignment?.insuranceExpiry ? new Date(dashboard.assignment.insuranceExpiry).toLocaleDateString() : 'N/A'}</div>
              </div>

              <div
                id="pre-trip-checklist"
                ref={(node) => { sectionRefs.current['pre-trip-checklist'] = node; }}
                style={pageCardStyle}
              >
                <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>Pending Checklist</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#f59e0b' }}>{dashboard?.pendingChecklistCount ?? 6}</div>
                <div style={{ color: '#94a3b8', marginTop: '6px', fontSize: '13px' }}>Checklist status: {dashboard?.checklist?.status || 'Pending'}</div>
              </div>

              <div
                id="notifications"
                ref={(node) => { sectionRefs.current.notifications = node; }}
                style={{ ...pageCardStyle, gridColumn: '1 / -1' }}
              >
                <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>Recent Notifications</div>
                <div style={{ display: 'grid', gap: '10px' }}>
                  {(dashboard?.notifications || []).map((item) => (
                    <div key={item._id || item.id} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '12px 14px' }}>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: '#f1f5f9' }}>{item.title}</div>
                      <div style={{ color: '#94a3b8', marginTop: '4px', fontSize: '13px' }}>{item.message}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                id="pre-trip-checklist-form"
                ref={(node) => { sectionRefs.current['pre-trip-checklist-form'] = node; }}
                style={{ ...pageCardStyle, gridColumn: '1 / -1' }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                  <ClipboardCheck size={20} color="#3b82f6" />
                  <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Pre-Trip Inspection Checklist</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                  {Object.entries(checklist).map(([key, value]) => (
                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0f172a', border: '1px solid #334155', padding: '10px 14px', borderRadius: '6px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={value} onChange={() => handleChecklistChange(key)} />
                      <span style={{ textTransform: 'capitalize', fontSize: '13px', color: '#f1f5f9' }}>{key}</span>
                    </label>
                  ))}
                </div>
                <div style={{ marginTop: '18px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button type="button" onClick={handleChecklistSubmit} style={{ backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '10px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Submit Checklist</button>
                  <button type="button" onClick={handleStartTrip} disabled={!checklistComplete} style={{ backgroundColor: checklistComplete ? '#22c55e' : '#334155', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '10px 18px', fontSize: '13px', fontWeight: 600, cursor: checklistComplete ? 'pointer' : 'not-allowed' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><PlayCircle size={15} /> Start Trip</span>
                  </button>
                </div>
                {checklistMessage && <div style={{ marginTop: '12px', color: checklistMessage.includes('success') ? '#22c55e' : '#ef4444', fontSize: '13px' }}>{checklistMessage}</div>}
              </div>

              <div
                id="assignment-history"
                ref={(node) => { sectionRefs.current['assignment-history'] = node; }}
                style={{ ...pageCardStyle, gridColumn: '1 / -1' }}
              >
                <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>Assignment History</div>
                <div style={{ overflowX: 'auto', border: '1px solid #334155', borderRadius: '6px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ backgroundColor: '#0f172a', color: '#94a3b8', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #334155' }}>Vehicle Number</th>
                        <th style={{ backgroundColor: '#0f172a', color: '#94a3b8', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #334155' }}>Assigned By</th>
                        <th style={{ backgroundColor: '#0f172a', color: '#94a3b8', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #334155' }}>Assigned Date</th>
                        <th style={{ backgroundColor: '#0f172a', color: '#94a3b8', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #334155' }}>Released Date</th>
                        <th style={{ backgroundColor: '#0f172a', color: '#94a3b8', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #334155' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(assignments || []).length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ padding: '18px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                            No assignment history recorded.
                          </td>
                        </tr>
                      ) : (
                        (assignments || []).map((entry) => (
                          <tr key={entry._id || entry.vehicleId}>
                            <td style={{ padding: '14px 16px', fontSize: '13px', color: '#f1f5f9', borderBottom: '1px solid #334155', fontWeight: 700 }}>
                              {entry.registrationNumber || entry.vehicleNumber}
                            </td>
                            <td style={{ padding: '14px 16px', fontSize: '13px', color: '#f1f5f9', borderBottom: '1px solid #334155' }}>
                              {entry.assignedBy || 'Fleet Manager'}
                            </td>
                            <td style={{ padding: '14px 16px', fontSize: '13px', color: '#f1f5f9', borderBottom: '1px solid #334155' }}>
                              {entry.assignedDate ? new Date(entry.assignedDate).toLocaleDateString() : '-'}
                            </td>
                            <td style={{ padding: '14px 16px', fontSize: '13px', color: '#f1f5f9', borderBottom: '1px solid #334155' }}>
                              {entry.unassignedDate || entry.returnDate ? new Date(entry.unassignedDate || entry.returnDate).toLocaleDateString() : 'In Operation'}
                            </td>
                            <td style={{ padding: '14px 16px', fontSize: '13px', color: '#f1f5f9', borderBottom: '1px solid #334155' }}>
                              {entry.status}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div
                id="report-issue"
                ref={(node) => { sectionRefs.current['report-issue'] = node; }}
                style={{ ...pageCardStyle, gridColumn: '1 / -1' }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                  <AlertTriangle size={20} color="#ef4444" />
                  <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Report Vehicle Issue</h2>
                </div>
                <form onSubmit={handleIssueSubmit} style={{ display: 'grid', gap: '14px', maxWidth: '600px' }}>
                  <input value={issueForm.issueType} onChange={(e) => setIssueForm({ ...issueForm, issueType: e.target.value })} placeholder="Issue Type (e.g. Engine Warning Light)" style={{ backgroundColor: '#0f172a', color: '#f1f5f9', border: '1px solid #334155', borderRadius: '6px', padding: '10px 14px', fontSize: '14px', outline: 'none' }} required />
                  <textarea value={issueForm.description} onChange={(e) => setIssueForm({ ...issueForm, description: e.target.value })} placeholder="Detailed description of the issue" style={{ backgroundColor: '#0f172a', color: '#f1f5f9', border: '1px solid #334155', borderRadius: '6px', padding: '10px 14px', fontSize: '14px', minHeight: '110px', outline: 'none' }} required />
                  <select value={issueForm.priority} onChange={(e) => setIssueForm({ ...issueForm, priority: e.target.value })} style={{ backgroundColor: '#0f172a', color: '#f1f5f9', border: '1px solid #334155', borderRadius: '6px', padding: '10px 14px', fontSize: '14px', outline: 'none' }}>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                  <button type="submit" style={{ backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '10px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', width: 'max-content' }}>Submit Report</button>
                </form>
                {issueMessage && <div style={{ marginTop: '12px', color: issueMessage.includes('success') ? '#22c55e' : '#ef4444', fontSize: '13px' }}>{issueMessage}</div>}
              </div>

              <div
                id="service-history"
                ref={(node) => { sectionRefs.current['service-history'] = node; }}
                style={{ ...pageCardStyle, gridColumn: '1 / -1' }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                  <Wrench size={20} color="#3b82f6" />
                  <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Service & Maintenance History</h2>
                </div>
                <div style={{ display: 'grid', gap: '10px' }}>
                  {(serviceHistory || []).map((entry) => (
                    <div key={entry._id || entry.performedDate} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '12px 14px' }}>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: '#f1f5f9' }}>{entry.serviceType}</div>
                      <div style={{ color: '#94a3b8', marginTop: '4px', fontSize: '13px' }}>{new Date(entry.performedDate).toLocaleDateString()} • {entry.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
