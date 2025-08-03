'use client';
import { useEffect, useState, useRef } from 'react';
import CaseForm from './components/CaseForm';

export default function MainPage() {
	const [cases, setCases] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [editing, setEditing] = useState(null);
	const [selectedIds, setSelectedIds] = useState(new Set());
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [analysisResult, setAnalysisResult] = useState(null);
	const [resultName, setResultName] = useState('');
	const [savedResults, setSavedResults] = useState([]);
	const [showSavedResults, setShowSavedResults] = useState(false);
	const [posterImageUrl, setPosterImageUrl] = useState('');
	const [posterText, setPosterText] = useState('');
	const [posterTextColor, setPosterTextColor] = useState('#000000'); // black
	const [posterTextSize, setPosterTextSize] = useState(12); // from 24 → 12
	const [savedResultId, setSavedResultId] = useState(null);
	const [posterName, setPosterName] = useState('');
	const [hasEditedText, setHasEditedText] = useState(false);
	const posterTextRef = useRef(null);

	const loadData = () => {
		fetch('/api/cases')
			.then((res) => res.json())
			.then(setCases)
			.catch(() => setCases([]));
	};

	useEffect(() => {
		loadData();
	}, []);

	const toggleSelect = (id) => {
		setSelectedIds((prev) => {
			const newSet = new Set(prev);
			newSet.has(id) ? newSet.delete(id) : newSet.add(id);
			return newSet;
		});
	};

	const toggleSelectAll = () => {
		if (selectedIds.size === cases.length) {
			setSelectedIds(new Set());
		} else {
			setSelectedIds(new Set(cases.map((c) => c.id)));
		}
	};

	const deleteSelectedCases = () => {
		if (selectedIds.size === 0) {
			alert('削除する案件を選択してください');
			return;
		}
		if (!confirm(`選択した${selectedIds.size}件を削除してよろしいですか？`)) {
			return;
		}

		fetch('/api/cases/delete', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ids: Array.from(selectedIds) }),
		})
			.then((res) => {
				if (!res.ok) throw new Error('削除に失敗しました');
				return res.json();
			})
			.then(() => {
				loadData();
				setSelectedIds(new Set());
			})
			.catch((err) => {
				alert(err.message);
			});
	};

	const handleStartAnalysis = () => {
		if (!startDate || !endDate) {
			alert('開始日と終了日を選択してください。');
			return;
		}
		if (startDate > endDate) {
			alert('開始日は終了日より前にしてください。');
			return;
		}
		const filtered = cases.filter(
			(c) => c.date >= startDate && c.date <= endDate
		);
		if (filtered.length === 0) {
			alert('該当するデータがありません。');
			return;
		}

		fetch('/api/analyze', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				startDate,
				endDate,
				cases: filtered,
			}),
		})
			.then((res) => {
				if (!res.ok) throw new Error('分析APIエラー');
				return res.text(); // plain text result
			})
			.then((resultText) => {
				setAnalysisResult(resultText);
				alert('分析が完了しました');
			})
			.catch((err) => {
				console.error('分析エラー:', err);
				alert('分析中にエラーが発生しました。');
			});
	};

	const handleSaveResult = () => {
		if (!resultName || !analysisResult) {
			alert('名前と結果が必要です');
			return;
		}

		fetch('/api/results/save', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name: resultName,
				startDate,
				endDate,
				result: analysisResult,
			}),
		})
			.then((res) => {
				if (!res.ok) throw new Error('保存失敗');
				return res.json();
			})
			.then((data) => {
				alert('保存しました');
				setSavedResultId(data.id);
			})
			.catch((err) => {
				console.error('保存エラー:', err);
				alert('保存中にエラーが発生しました');
			});
	};

	const openSavedResults = () => {
		fetch('/api/results/list')
			.then((res) => res.json())
			.then(setSavedResults)
			.catch(() => alert('以前の分析結果の取得に失敗しました'));
		setShowSavedResults(true);
	};

	useEffect(() => {
		function receiveSelectedResults(event) {
			if (event.data?.type === 'SELECTED_RESULTS') {
				const results = event.data.results;
				if (results.length > 0) {
					const r = results[0];
					setResultName(r.name);
					setStartDate(r.start_date);
					setEndDate(r.end_date);
					try {
						setAnalysisResult(JSON.parse(r.result));
					} catch {
						setAnalysisResult(r.result);
					}
				}
			}
		}
		window.addEventListener('message', receiveSelectedResults);
		return () => window.removeEventListener('message', receiveSelectedResults);
	}, []);

	useEffect(() => {
		function receiveSelectedPoster(event) {
			if (event.data?.type === 'SELECTED_POSTER') {
				const p = event.data.poster;
				setPosterName(p.name);
				setPosterText(p.text);
				setPosterImageUrl(p.poster_url);
				setPosterTextColor(p.text_color);
				setPosterTextSize(p.text_size);
				setSavedResultId(p.result_id); // Save the result_id

				// Fetch the related analysis result by result_id
				if (p.result_id) {
					fetch(`/api/results/get?id=${p.result_id}`)
						.then((res) => {
							if (!res.ok) throw new Error('Failed to load related result');
							return res.json();
						})
						.then((data) => {
							setResultName(data.name);
							setStartDate(data.start_date);
							setEndDate(data.end_date);
							setAnalysisResult(data.result);
						})
						.catch((err) => {
							console.error('Error loading related analysis result:', err);
							alert('関連する分析結果の読み込みに失敗しました。');
						});
				}
			}
		}

		window.addEventListener('message', receiveSelectedPoster);
		return () => window.removeEventListener('message', receiveSelectedPoster);
	}, []);

	const onPosterTextInput = (e) => {
		setPosterText(e.currentTarget.textContent);
		if (!hasEditedText) setHasEditedText(true);
	};

	return (
		<main className="min-h-screen bg-white text-black font-sans flex flex-col items-center p-[50px]">
			<header className="h-[100px] flex items-center justify-center bg-white text-black text-4xl font-bold mb-10 border-b border-gray-300 w-full text-center">
				PIO-NET
			</header>

			{/* 編集 Section */}
			<section className="w-full max-w-6xl mb-10">
				<h2 className="text-2xl font-bold mb-4">編集</h2>
				{/* Top action buttons */}
				<div className="flex justify-between mb-4 w-full max-w-6xl">
					<div className="space-x-2">
						<button
							onClick={deleteSelectedCases}
							className="border border-gray-300 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
						>
							削除
						</button>
						<button
							onClick={() => {
								if (selectedIds.size !== 1) {
									alert('編集する案件を1件だけ選択してください');
									return;
								}
								const selectedId = Array.from(selectedIds)[0];
								window.open(
									`/form?id=${selectedId}`,
									'_blank',
									'width=600,height=600'
								);
							}}
							className="border border-gray-300 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
						>
							編集
						</button>

						<button
							onClick={() => {
								window.open('/form', '_blank', 'width=600,height=600');
							}}
							className="border border-gray-300 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
						>
							＋追加
						</button>
					</div>
				</div>
				<div className="overflow-hidden">
					<table className="border border-gray-500 border-collapse w-full text-base">
						<thead className="bg-gray-100">
							<tr>
								<th className="border border-gray-500 p-3 text-center">
									<input
										type="checkbox"
										checked={
											selectedIds.size === cases.length && cases.length > 0
										}
										onChange={toggleSelectAll}
									/>
								</th>
								<th className="border border-gray-500 p-3">#</th>
								<th className="border border-gray-500 p-3">件名</th>
								<th className="border border-gray-500 p-3">相談要件</th>
								<th className="border border-gray-500 p-3">年月日</th>
								<th className="border border-gray-500 p-3">購入形態</th>
							</tr>
						</thead>
						<tbody>
							{cases.map((c, index) => (
								<tr key={c.id} className="hover:bg-gray-50">
									<td className="border border-gray-500 p-3 text-center">
										<input
											type="checkbox"
											checked={selectedIds.has(c.id)}
											onChange={() => toggleSelect(c.id)}
										/>
									</td>
									<td className="border border-gray-500 p-3 text-center">
										{index + 1}
									</td>
									<td className="border border-gray-500 p-3">{c.name}</td>
									<td className="border border-gray-500 p-3">{c.content}</td>
									<td className="border border-gray-500 p-3">{c.date}</td>
									<td className="border border-gray-500 p-3">{c.type}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			{/* 分析 Section */}
			<section className="w-full max-w-6xl">
				<h2 className="text-2xl font-bold mb-4">分析</h2>
				<div className="p-4 border rounded-md bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
					<div className="flex flex-col">
						<label htmlFor="startDate" className="mb-1 font-medium">
							開始日
						</label>
						<input
							type="date"
							id="startDate"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
							className="border border-gray-300 rounded px-3 py-2"
						/>
					</div>
					<div className="flex flex-col">
						<label htmlFor="endDate" className="mb-1 font-medium">
							終了日
						</label>
						<input
							type="date"
							id="endDate"
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
							className="border border-gray-300 rounded px-3 py-2"
						/>
					</div>
					<button
						onClick={handleStartAnalysis}
						className="mt-2 sm:mt-6 border border-blue-700 bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
					>
						分析開始
					</button>

					<button
						onClick={() => {
							window.open(
								'/saved-results-popup',
								'_blank',
								'width=600,height=600'
							);
						}}
						className="border border-gray-600 bg-gray-600 text-white px-4 py-1 rounded ml-4 hover:bg-gray-700 transition"
					>
						以前分析結果を選択
					</button>
				</div>

				<div className="w-full max-w-4xl mt-6">
					<h3 className="text-lg font-bold mb-2">📊 分析結果 (JSON)</h3>
					<textarea
						readOnly
						className="w-full h-64 border p-2 font-mono text-sm bg-gray-50"
						value={analysisResult || ''}
					/>
					<div className="mt-4 flex items-center gap-2">
						<input
							type="text"
							className="border px-3 py-1 w-64 rounded"
							placeholder="結果の名前"
							value={resultName}
							onChange={(e) => setResultName(e.target.value)}
						/>
						<button
							className="border border-green-700 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition"
							onClick={handleSaveResult}
						>
							保存
						</button>
					</div>
				</div>
			</section>

			{/* ポスター作成・編集 Section */}
			<section className="w-full max-w-6xl mt-10">
				<h2 className="text-2xl font-bold mb-4">🖼️ ポスター作成・編集</h2>

				<div
					className="mx-auto border-black border-3"
					style={{
						width: '400px',
						height: '400px',
						backgroundColor: posterImageUrl ? 'transparent' : '#888888',
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					{/* Image area: fixed 400x300 */}
					<div
						style={{
							width: '400px',
							height: '300px',
							overflow: 'hidden',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: posterImageUrl ? 'transparent' : '#888888',
						}}
					>
						{posterImageUrl ? (
							<img
								src={posterImageUrl}
								alt="ポスター"
								style={{
									maxWidth: '100%',
									maxHeight: '100%',
									objectFit: 'contain',
									display: 'block',
								}}
								onError={(e) => {
									e.target.onerror = null;
									e.target.style.display = 'none';
									e.target.parentNode.style.backgroundColor = '#888888';
								}}
							/>
						) : (
							<div style={{ color: '#ccc', fontSize: '18px' }}>
								画像がありません
							</div>
						)}
					</div>

					{/* Text area: fixed 400x100 with centered editable text and placeholder */}
					<div
						style={{
							position: 'relative',
							width: '400px',
							height: '100px',
							backgroundColor: 'rgba(255, 255, 255, 0.9)',
							fontSize: `${posterTextSize}px`,
							fontWeight: 'bold',
							padding: '0 10px',
							textAlign: 'center',
							whiteSpace: 'pre-wrap',
							overflowY: 'auto',
							boxSizing: 'border-box',
						}}
					>
						{/* Placeholder */}
						{!posterText && (
							<div
								style={{
									position: 'absolute',
									pointerEvents: 'none',
									color: '#aaa',
									top: '50%',
									left: '50%',
									transform: 'translate(-50%, -50%)',
									userSelect: 'none',
									fontSize: `${posterTextSize}px`,
								}}
							>
								テキストを入力してください
							</div>
						)}

						{/* Editable text area */}
						<div
							contentEditable
							suppressContentEditableWarning
							onInput={(e) => {
								const text = e.currentTarget.innerText;
								setPosterText(text);
							}}
							style={{
								width: '100%',
								height: '100%',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								color: posterTextColor,
								fontSize: `${posterTextSize}px`,
								fontWeight: 'bold',
								outline: 'none',
								overflowY: 'auto',
								caretColor: posterTextColor,
								textAlign: 'center',
								position: 'relative',
							}}
							spellCheck={false}
						/>
					</div>
				</div>

				{/* Control Buttons with Save Name Input */}
				<div className="mt-4 flex flex-wrap gap-3 justify-center items-center">
					<button
						className="border border-blue-700 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
						onClick={() => {
							if (!savedResultId) {
								alert('分析結果を選択してください。');
								return;
							}
							setPosterImageUrl('/some-generated-image.jpg');
							setPosterText('分析結果ポスター');
						}}
					>
						自動ポスター作成開始
					</button>

					<input
						type="text"
						placeholder="保存名前"
						className="border px-3 py-2 w-60 rounded"
						value={posterName}
						onChange={(e) => setPosterName(e.target.value)}
					/>

					<button
						className="border border-gray-600 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
						onClick={() => {
							const newColor = prompt(
								'テキストの色を入力 (例: #ff0000)',
								posterTextColor
							);
							if (newColor) setPosterTextColor(newColor);
						}}
					>
						テキスト色
					</button>

					<button
						className="border border-gray-600 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
						onClick={() => {
							const size = prompt('テキストサイズ(px)', posterTextSize);
							if (size && !isNaN(size)) setPosterTextSize(Number(size));
						}}
					>
						テキストサイズ
					</button>

					<button
						className="border border-green-700 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
						onClick={async () => {
							if (!posterName || !posterImageUrl || !analysisResult) {
								alert('すべての情報（名前、画像、分析結果）が必要です');
								return;
							}

							const posterData = {
								name: posterName,
								text: posterText,
								poster_url: posterImageUrl,
								image_url: posterImageUrl,
								result_id: savedResultId,
								text_size: posterTextSize,
								text_color: posterTextColor,
							};

							const res = await fetch('/api/posters/save', {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify(posterData),
							});

							if (res.ok) {
								alert('ポスターを保存しました');
							} else {
								alert('保存に失敗しました');
							}
						}}
					>
						保存
					</button>

					<button className="border border-purple-700 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">
						ダウンロード
					</button>

					<button
						className="border border-gray-700 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
						onClick={() => {
							window.open(
								'/saved-posters-popup',
								'_blank',
								'width=600,height=600'
							);
						}}
					>
						以前ポスターを選択
					</button>
				</div>
			</section>

			{/* Modal Form */}
			{showForm && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="relative bg-white p-6 rounded shadow-lg w-[500px] max-w-full">
						<button
							type="button"
							onClick={() => setShowForm(false)}
							className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
							aria-label="Close form"
						>
							×
						</button>

						<CaseForm
							defaultData={editing}
							onClose={() => setShowForm(false)}
							onSuccess={() => {
								loadData();
								setShowForm(false);
							}}
						/>
					</div>
				</div>
			)}

			{showSavedResults && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded shadow max-w-md w-full max-h-[80vh] overflow-auto">
						<h3 className="text-xl font-bold mb-4">以前の分析結果を選択</h3>
						<button
							className="mb-4 px-3 py-1 bg-gray-300 rounded"
							onClick={() => setShowSavedResults(false)}
						>
							閉じる
						</button>
						<ul className="space-y-2">
							{savedResults.length === 0 && (
								<li>保存された結果がありません。</li>
							)}
							{savedResults.map((r) => (
								<li
									key={r.id}
									className="p-2 border rounded cursor-pointer hover:bg-gray-100"
									onClick={() => {
										fetch(`/api/results/get?id=${r.id}`)
											.then((res) => res.json())
											.then((data) => {
												setResultName(data.name);
												setStartDate(data.start_date);
												setEndDate(data.end_date);
												setAnalysisResult(data.result);
												setSavedResultId(data.id);
												setShowSavedResults(false);
											})
											.catch(() => alert('結果の読み込みに失敗しました'));
									}}
								>
									<strong>{r.name}</strong> — {r.start_date} ~ {r.end_date}
								</li>
							))}
						</ul>
					</div>
				</div>
			)}
		</main>
	);
}
