import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Download, Share2, BarChart2 } from 'lucide-react';

const AnalysisPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/analysis');
                setData(response.data);
            } catch (error) {
                console.error("Analysis error", error);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleExport = () => {
        window.location.href = 'http://localhost:5000/api/export/zip';
    };

    if (loading) return <div className="text-center mt-20">Calcul des métriques et génération des graphes...</div>;
    if (!data) return <div className="text-center mt-20 text-red-500">Aucune donnée d'analyse disponible. Veuillez chiffrer une image d'abord.</div>;

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Tableau de Bord Analytique</h2>
                    <p className="text-gray-400">Métriques de sécurité et preuves graphiques</p>
                </div>
                <button
                    onClick={handleExport}
                    className="bg-accent hover:bg-accent/80 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:-translate-y-1 transition-all"
                >
                    <Download size={18} /> Tout Exporter (ZIP)
                </button>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-6 rounded-xl border-t-4 border-primary">
                    <h3 className="text-gray-400 text-sm font-semibold uppercase">Espace Clé</h3>
                    <p className="text-3xl font-bold mt-2">2<sup>299</sup></p>
                    <p className="text-xs text-green-400 mt-1">Supérieur à AES-256</p>
                </div>
                <div className="glass-card p-6 rounded-xl border-t-4 border-purple-500">
                    <h3 className="text-gray-400 text-sm font-semibold uppercase">Entropie</h3>
                    <p className="text-3xl font-bold mt-2">{data.metrics.entropy.encrypted.toFixed(5)}</p>
                    <p className="text-xs text-gray-500 mt-1">Idéal: 8.00000</p>
                </div>
                <div className="glass-card p-6 rounded-xl border-t-4 border-pink-500">
                    <h3 className="text-gray-400 text-sm font-semibold uppercase">NPCR</h3>
                    <p className="text-3xl font-bold mt-2">{data.metrics.npcr.toFixed(4)}%</p>
                    <p className="text-xs text-gray-500 mt-1">Idéal: &gt; 99.6%</p>
                </div>
                <div className="glass-card p-6 rounded-xl border-t-4 border-yellow-500">
                    <h3 className="text-gray-400 text-sm font-semibold uppercase">UACI</h3>
                    <p className="text-3xl font-bold mt-2">{data.metrics.uaci.toFixed(4)}%</p>
                    <p className="text-xs text-gray-500 mt-1">Idéal: ~33.46%</p>
                </div>
            </div>

            {/* Graphs Sections */}

            {/* Histograms */}
            <section>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><BarChart2 /> Histogrammes</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.graphs.histograms.filter(p => p.includes('enc')).map((path, i) => (
                        <div key={i} className="glass-card p-2 rounded-lg">
                            <img src={`http://localhost:5000${path}`} className="w-full rounded" alt="Histogram" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Correlations */}
            <section>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Share2 /> Corrélations (Chiffré)</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {data.graphs.correlation.filter(p => p.includes('enc')).slice(0, 6).map((path, i) => (
                        <div key={i} className="glass-card p-1 rounded-lg hover:scale-150 transition-transform z-0 hover:z-10 bg-dark-bg">
                            <img src={`http://localhost:5000${path}`} className="w-full rounded" alt="Correlation" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Metrics Plots */}
            <section>
                <h3 className="text-xl font-bold mb-4">Métriques Visuelles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.graphs.metrics.map((path, i) => (
                        <div key={i} className="glass-card p-4 rounded-xl">
                            <img src={`http://localhost:5000${path}`} className="w-full rounded" alt="Metric Plot" />
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
};

export default AnalysisPage;
