// ✅ src/app/form/page.jsx
'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import CaseForm from '../components/CaseForm';

export default function FormPage() {
	const searchParams = useSearchParams();
	const id = searchParams.get('id');
	const [caseData, setCaseData] = useState(null);

	useEffect(() => {
		if (id) {
			fetch(`/api/cases/${id}`) // ← you need this API
				.then((res) => res.json())
				.then((data) => setCaseData(data))
				.catch(() => alert('Failed to load data'));
		}
	}, [id]);

	return (
		<div className="p-6 bg-white">
			<CaseForm
				defaultData={caseData || {}}
				onClose={() => window.close()}
				onSuccess={() => {
					alert('保存しました');
					window.close(); // Close popup after success
				}}
			/>
		</div>
	);
}
