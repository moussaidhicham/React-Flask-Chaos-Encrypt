import React from 'react';

const ParameterSlider = ({ label, value, onChange, min, max, step, description }) => {
    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                <div className="bg-primary/20 px-2 py-1 rounded text-primary text-xs font-mono">
                    {value}
                </div>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-accent transition-all"
            />
            {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
    );
};

const ChaosParameters = ({ params, setParams }) => {

    const handleChange = (key, value) => {
        setParams(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl font-black">LOG</div>
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 mb-6">Carte Logistique</h3>
                <ParameterSlider
                    label="X0 (Condition Initiale)"
                    value={params.log_x0}
                    onChange={(v) => handleChange('log_x0', v)}
                    min={0.001} max={0.999} step={0.001}
                    description="Doit être entre 0 et 1"
                />
                <ParameterSlider
                    label="μ (Paramètre de contrôle)"
                    value={params.log_mu}
                    onChange={(v) => handleChange('log_mu', v)}
                    min={3.57} max={4.0} step={0.001}
                    description="Chaos pour μ ∈ [3.57, 4]"
                />
            </div>

            <div className="glass-card p-6 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl font-black">TEN</div>
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600 mb-6">Carte Tente</h3>
                <ParameterSlider
                    label="X0 (Condition Initiale)"
                    value={params.tent_x0}
                    onChange={(v) => handleChange('tent_x0', v)}
                    min={0.001} max={0.999} step={0.001}
                />
                <ParameterSlider
                    label="r (Paramètre de contrôle)"
                    value={params.tent_r}
                    onChange={(v) => handleChange('tent_r', v)}
                    min={0.1} max={1.99} step={0.01}
                    description="Chaos pour r proche de 2"
                />
            </div>

            <div className="glass-card p-6 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl font-black">PWL</div>
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-6">Carte PWLCM</h3>
                <ParameterSlider
                    label="X0 (Condition Initiale)"
                    value={params.pwlcm_x0}
                    onChange={(v) => handleChange('pwlcm_x0', v)}
                    min={0.001} max={0.999} step={0.001}
                />
                <ParameterSlider
                    label="p (Paramètre de contrôle)"
                    value={params.pwlcm_p}
                    onChange={(v) => handleChange('pwlcm_p', v)}
                    min={0.001} max={0.499} step={0.001}
                    description="Doit être < 0.5"
                />
            </div>
        </div>
    );
};

export default ChaosParameters;
