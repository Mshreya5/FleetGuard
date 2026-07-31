import React, { useState } from 'react';
import { COLORS, COMMON_STYLES } from '../utils/styles';
import { uploadComplianceDocument } from '../services/api';

const DOC_TYPES = ["Insurance", "Pollution Certificate", "Fitness Certificate", "RC"];

const ComplianceCard = ({ vehicles = [], selectedVehicle, onUploadSuccess, showToast }) => {
    const [vehicleId, setVehicleId] = useState(selectedVehicle?._id || (vehicles[0]?._id || ''));
    const [documentType, setDocumentType] = useState('Insurance');
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
    const [expiryDate, setExpiryDate] = useState(
        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    );
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!vehicleId) {
            showToast('Please select a vehicle', 'danger');
            return;
        }
        if (!file) {
            showToast('Please select a document file to upload', 'danger');
            return;
        }
        if (!issueDate || !expiryDate) {
            showToast('Please specify both issue date and expiry date', 'danger');
            return;
        }

        const formData = new FormData();
        formData.append('vehicleId', vehicleId);
        formData.append('documentType', documentType);
        formData.append('issueDate', issueDate);
        formData.append('expiryDate', expiryDate);
        formData.append('document', file);

        setIsUploading(true);
        try {
            await uploadComplianceDocument(formData);
            showToast(`${documentType} uploaded successfully with Multer`, 'success');
            setFile(null);
            if (onUploadSuccess) onUploadSuccess();
        } catch (err) {
            showToast(err.message || 'Upload failed', 'danger');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div style={COMMON_STYLES.card}>
            <div style={{ marginBottom: '20px', borderBottom: `1px solid ${COLORS.border}`, paddingBottom: '12px' }}>
                <h2 style={COMMON_STYLES.heading}>FG-FM-07 & FG-FM-08: Compliance Document Upload</h2>
                <p style={COMMON_STYLES.subheading}>
                    Upload Insurance, Pollution, Fitness, or RC certificates to calculate compliance status
                </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
                    {/* Vehicle Selector */}
                    <div>
                        <label style={COMMON_STYLES.label}>Select Vehicle *</label>
                        <select
                            value={vehicleId}
                            onChange={(e) => setVehicleId(e.target.value)}
                            style={COMMON_STYLES.select}
                        >
                            <option value="">-- Choose Vehicle --</option>
                            {vehicles.map(v => (
                                <option key={v._id} value={v._id}>
                                    {v.registrationNumber} ({v.brand} {v.model} - {v.branch})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Document Type */}
                    <div>
                        <label style={COMMON_STYLES.label}>Document Type *</label>
                        <select
                            value={documentType}
                            onChange={(e) => setDocumentType(e.target.value)}
                            style={COMMON_STYLES.select}
                        >
                            {DOC_TYPES.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    {/* Issue Date */}
                    <div>
                        <label style={COMMON_STYLES.label}>Issue Date *</label>
                        <input
                            type="date"
                            value={issueDate}
                            onChange={(e) => setIssueDate(e.target.value)}
                            style={COMMON_STYLES.input}
                        />
                    </div>

                    {/* Expiry Date */}
                    <div>
                        <label style={COMMON_STYLES.label}>Expiry Date *</label>
                        <input
                            type="date"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            style={COMMON_STYLES.input}
                        />
                    </div>
                </div>

                {/* File Upload Input */}
                <div style={{
                    border: `2px dashed ${COLORS.border}`,
                    borderRadius: '8px',
                    padding: '24px',
                    textAlign: 'center',
                    backgroundColor: COLORS.background,
                    marginTop: '6px'
                }}>
                    <input
                        type="file"
                        id="document-file-input"
                        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="document-file-input" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: COLORS.text }}>
                            {file ? `Selected File: ${file.name}` : 'Click to select document file (PDF, PNG, JPG)'}
                        </span>
                        <span style={{ fontSize: '11px', color: COLORS.muted }}>
                            Uploads using Multer middleware to backend uploads directory
                        </span>
                    </label>
                </div>

                {/* Submit button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                    <button
                        type="submit"
                        disabled={isUploading}
                        style={{
                            ...COMMON_STYLES.buttonPrimary,
                            opacity: isUploading ? 0.7 : 1
                        }}
                    >
                        {isUploading ? 'Uploading File...' : 'Upload & Update Compliance'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ComplianceCard;
