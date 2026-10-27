import fs from 'node:fs';

let code = fs.readFileSync('src/store/data.ts', 'utf8');

// 1. Add isSyncing and syncWithBackend to DataState interface
if (!code.includes('syncWithBackend: () => Promise<void>;')) {
  code = code.replace(
    '  sourceHealth: SourceHealth;\n\n  resetDemo: () => void;',
    '  sourceHealth: SourceHealth;\n  isSyncing: boolean;\n  syncWithBackend: () => Promise<void>;\n\n  resetDemo: () => void;'
  );
  if (!code.includes('syncWithBackend: () => Promise<void>;')) {
    code = code.replace(
      '  sourceHealth: SourceHealth;\r\n\r\n  resetDemo: () => void;',
      '  sourceHealth: SourceHealth;\r\n  isSyncing: boolean;\r\n  syncWithBackend: () => Promise<void>;\r\n\r\n  resetDemo: () => void;'
    );
  }
}

// 2. Add isSyncing and syncWithBackend to useData definition
const syncImplementation = `  sourceHealth: dbRead<SourceHealth>('source_health', DEFAULT_SOURCE_HEALTH),
  isSyncing: false,

  syncWithBackend: async () => {
    try {
      const { fetchBackendSnapshot, isConfigured } = await import('@/pilot/api');
      if (!isConfigured) return;
      useData.setState({ isSyncing: true });
      const snap = await fetchBackendSnapshot();

      const serverApps: Application[] = (snap.applications || []).map((row: any) => {
        const d = row.data || {};
        return {
          id: row.id,
          studentId: d.studentId || '',
          schemeId: d.schemeId || '',
          academicYear: d.academicYear || '2026-27',
          status: d.status || 'submitted',
          documentIds: Array.isArray(d.documentIds) ? d.documentIds : [],
          submittedAt: d.submittedAt,
          sanctionedAmount: d.sanctionedAmount,
          disbursedAmount: d.disbursedAmount,
          dbtStatus: d.dbtStatus,
          signatureUrl: d.signaturePath,
          rejectionReason: d.rejectionReason,
          bankAccountLast4: d.profileSnapshot?.aadhaarLast4 || '4821',
          pfmsTransactionId: d.dbtTxnRef || (d.dbtStatus === 'successful' ? \`PFMS-2026-\${row.id.slice(0, 8).toUpperCase()}\` : undefined),
          deficiency: d.deficiency,
        };
      });

      const serverStudents: Student[] = (snap.students || []).map((row: any) => {
        const d = row.data || {};
        return {
          id: row.id,
          name: d.name || 'Scholar',
          gender: d.gender || 'F',
          dob: d.dob || '2004-01-01',
          aadhaarLast4: d.aadhaarLast4 || '4821',
          tribe: d.tribe || 'Santhal',
          isPVTG: Boolean(d.isPVTG),
          category: 'ST',
          familyIncome: Number(d.familyIncome || 100000),
          fatherName: d.fatherName || 'Parent',
          domicileState: d.domicileState || 'Jharkhand',
          domicileDistrict: d.domicileDistrict || 'Ranchi',
          homeVillage: d.homeVillage || 'Village',
          language: d.language || 'en',
          courseLevel: d.courseLevel || 'undergrad',
          course: d.course || 'B.Tech',
          institutionId: d.institutionId || 'inst_bit_mesra',
          year: d.year || '2',
          familyViewConsent: Boolean(d.familyViewConsent),
        };
      });

      const serverDocs: StudentDocument[] = (snap.documents || []).map((row: any) => {
        const d = row.data || {};
        return {
          id: row.id,
          studentId: d.studentId || '',
          type: d.type || 'st_certificate',
          title: d.title || 'Official Document',
          version: Number(row.version || 1),
          uploadedAt: d.uploadedAt || new Date().toISOString(),
          status: d.status || 'verified',
          ocrText: d.title || 'Verified Digital Certificate',
          ocrFields: d.fields || {},
          reuseCount: serverApps.filter((a) => a.documentIds?.includes(row.id)).length,
        };
      });

      const serverSchemes: Scheme[] = (snap.schemes || []).map((row: any) => {
        const d = row.data || {};
        return {
          id: row.id,
          name: d.name || row.id,
          shortName: d.shortName || d.name || row.id,
          portal: d.portal || 'NSP',
          ministry: d.ministry || 'Ministry of Tribal Affairs',
          courseLevels: d.courseLevels || ['undergrad'],
          amount: d.amount || \`₹\${d.sanctionAmount || 30000}\`,
          benefits: d.benefits || ['Tuition support', 'Maintenance allowance'],
          deadline: d.deadline || '2026-11-30',
          requiredDocs: d.requiredDocs || ['st_certificate', 'income_certificate'],
          rules: d.rules || [],
          notes: d.notes || '',
          sanctionAmount: d.sanctionAmount || 30000,
        };
      });

      const serverGrievances: Grievance[] = (snap.grievances || []).map((row: any) => {
        const d = row.data || {};
        return {
          id: row.id,
          studentId: d.studentId || '',
          category: d.category || 'General',
          subject: d.subject || 'Support Request',
          body: d.body || '',
          status: d.status || 'open',
          createdAt: d.createdAt || new Date().toISOString(),
          assignedTo: d.assignedTo,
        };
      });

      const serverNotifs: Notification[] = (snap.notifications || []).map((row: any) => {
        const d = row.data || {};
        return {
          id: row.id,
          userId: d.userId || '',
          title: d.title || 'Update',
          body: d.body || '',
          channel: 'in_app' as const,
          category: (d.category as any) || 'info',
          severity: d.category === 'deficiency' ? ('warning' as const) : ('info' as const),
          createdAt: d.createdAt || new Date().toISOString(),
        };
      });

      const serverAudit: AuditEntry[] = (snap.audit || []).map((row: any) => {
        const d = row.data || {};
        return {
          id: row.id,
          actor: d.actorId || 'system',
          action: d.action || 'action',
          entity: d.entityId || 'system',
          ts: d.createdAt || new Date().toISOString(),
          detail: typeof d.detail === 'string' ? d.detail : JSON.stringify(d.detail || ''),
        };
      });

      const current = useData.getState();
      const mergedApps = [...serverApps, ...current.applications.filter((a) => !serverApps.some((sa) => sa.id === a.id))];
      const mergedStudents = [...serverStudents, ...current.students.filter((s) => !serverStudents.some((ss) => ss.id === s.id))];
      const mergedDocs = withReuseCounts(
        [...serverDocs, ...current.documents.filter((d) => !serverDocs.some((sd) => sd.id === d.id))],
        mergedApps
      );
      const mergedSchemes = [...serverSchemes, ...current.schemes.filter((sc) => !serverSchemes.some((ssc) => ssc.id === sc.id))];
      const mergedGrievances = [...serverGrievances, ...current.grievances.filter((g) => !serverGrievances.some((sg) => sg.id === g.id))];
      const mergedNotifs = [...serverNotifs, ...current.notifications.filter((n) => !serverNotifs.some((sn) => sn.id === n.id))];
      const mergedAudit = [...serverAudit, ...current.audit.filter((a) => !serverAudit.some((sa) => sa.id === a.id))];

      dbWrite('applications', mergedApps);
      dbWrite('students', mergedStudents);
      dbWrite('documents', mergedDocs);
      dbWrite('grievances', mergedGrievances);
      dbWrite('notifs', mergedNotifs);
      dbWrite('audit', mergedAudit);

      useData.setState({
        applications: mergedApps,
        students: mergedStudents,
        documents: mergedDocs,
        schemes: mergedSchemes,
        grievances: mergedGrievances,
        notifications: mergedNotifs,
        audit: mergedAudit,
        isSyncing: false,
      });
    } catch (e) {
      console.warn('Backend sync failed, maintaining local cache:', e);
      useData.setState({ isSyncing: false });
    }
  },`;

if (!code.includes('syncWithBackend: async () =>')) {
  code = code.replace(
    /sourceHealth: dbRead<SourceHealth>\('source_health', DEFAULT_SOURCE_HEALTH\),/,
    syncImplementation
  );
}

// 3. Add dispatch to submitApplication
if (!code.includes("invoke('submit_application'")) {
  code = code.replace(
    "get().runVerification(id);\n    return id;",
    `get().runVerification(id);
    try {
      import('@/pilot/api').then(({ invoke, isConfigured }) => {
        if (isConfigured) {
          invoke('submit_application', { studentId, schemeId, academicYear: '2026-27' }).catch((e) =>
            console.warn('Backend workflow dispatch note:', e)
          );
        }
      });
    } catch {}
    return id;`
  );
}

// 4. Add dispatch to sanctionApplication
if (!code.includes("invoke('sanction'")) {
  code = code.replace(
    "return true;\n  },\n\n  pushDbt:",
    `try {
      import('@/pilot/api').then(({ invoke, isConfigured }) => {
        if (isConfigured) {
          invoke('sanction', { applicationId, signatureUrl, sanctionedAmount: amount }).catch((e) =>
            console.warn('Backend sanction dispatch note:', e)
          );
        }
      });
    } catch {}
    return true;
  },

  pushDbt:`
  );
}

// 5. Add dispatch to createGrievance
if (!code.includes("invoke('create_grievance'")) {
  code = code.replace(
    "return id;\n  },\n\n  resolveGrievance:",
    `try {
      import('@/pilot/api').then(({ invoke, isConfigured }) => {
        if (isConfigured) {
          invoke('create_grievance', { studentId, category, subject, body }).catch((e) =>
            console.warn('Backend grievance dispatch note:', e)
          );
        }
      });
    } catch {}
    return id;
  },

  resolveGrievance:`
  );
}

fs.writeFileSync('src/store/data.ts', code, 'utf8');
console.log('src/store/data.ts updated successfully.');
