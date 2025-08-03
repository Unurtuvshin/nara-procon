'use client';
import { useEffect, useState } from 'react';

export default function SavedPostersPopup() {
	const [posters, setPosters] = useState([]);
	const [selectedId, setSelectedId] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		fetch('/api/posters/list')
			.then((res) => res.json())
			.then(setPosters)
			.catch(() => alert('ポスターの取得に失敗しました'));
	}, []);

	const handleConfirmSelection = () => {
		const selected = posters.find((p) => p.id === selectedId);
		if (!selected) {
			alert('ポスターを選択してください');
			return;
		}

		window.opener.postMessage(
			{
				type: 'SELECTED_POSTER',
				poster: selected,
			},
			'*'
		);
		window.close();
	};

	const filteredPosters = posters.filter((p) =>
		p.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="p-6 bg-white text-black max-h-screen overflow-y-auto">
			<h2 className="text-xl font-bold mb-4">以前のポスターを選択</h2>

			<input
				type="text"
				placeholder="ポスター名で検索"
				className="mb-4 w-full border rounded px-3 py-2"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>

			{filteredPosters.length === 0 && <p>保存されたポスターがありません。</p>}

			<ul className="space-y-4">
				{filteredPosters.map((p) => (
					<li
						key={p.id}
						className="p-3 border rounded flex items-center space-x-6"
					>
						<input
							type="radio"
							name="selectedPoster"
							checked={selectedId === p.id}
							onChange={() => setSelectedId(p.id)}
							className="mt-1"
						/>
						<img
							src={p.image_url}
							alt="poster"
							className="w-40 h-40 object-contain border"
						/>
						<div className="flex flex-col text-sm max-w-xs">
							<div className="font-bold">{p.name}</div>
							<div className="text-gray-700 break-words whitespace-pre-wrap max-h-32 overflow-auto">
								📝 {p.text}
							</div>
							<div className="text-gray-500 text-xs mt-2">
								サイズ: {p.text_size}px / 色: {p.text_color}
							</div>
						</div>
					</li>
				))}
			</ul>

			<button
				className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
				onClick={handleConfirmSelection}
			>
				このポスターを使用する
			</button>
		</div>
	);
}
