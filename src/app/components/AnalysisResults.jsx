"use client";
import Image from "next/image";

export default function AnalysisResults() {
  // spider/network graphs
  const networkImages = [
    "data/slash_data-main/results_cooccurrence/networks/network_1_2023-04~05.png",
    "data/slash_data-main/results_cooccurrence/networks/network_2_2023-06~07.png",
    "data/slash_data-main/results_cooccurrence/networks/network_3_2023-08~09.png",
    "data/slash_data-main/results_cooccurrence/networks/network_4_2023-10~11.png",
    "data/slash_data-main/results_cooccurrence/networks/network_5_2023-12~01.png",
    "data/slash_data-main/results_cooccurrence/networks/network_6_2024-02~03.png",
  ];

  // timeseries and table
  const timeseriesImage =
    "data/slash_data-main/results_cooccurrence/charts/timeseries.png";
  const tableImage =
    "data/slash_data-main/results_cooccurrence/tables/table_top_pairs.png";

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Network Graphs</h2>
      <div className="grid grid-cols-2 gap-4">
        {networkImages.map((src, idx) => (
          <div key={idx} className="border p-2">
            <Image
              src={`/${src}`}
              alt={`Network graph ${idx + 1}`}
              width={400}
              height={400}
              className="object-contain"
            />
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold">Timeseries Chart</h2>
      <div className="border p-2">
        <img
          src="/data/slash_data-main/results_cooccurrence/charts/timeseries.png"
          alt="Timeseries chart"
          style={{ width: "800px", height: "auto", objectFit: "contain" }}
        />
      </div>

      <h2 className="text-xl font-bold">Top Pairs Table</h2>
      <div className="border p-2">
        <img
          src="/data/slash_data-main/results_cooccurrence/tables/table_top_pairs.png"
          alt="Top pairs table"
          style={{ width: "800px", height: "auto", objectFit: "contain" }}
        />
      </div>
    </div>
  );
}
