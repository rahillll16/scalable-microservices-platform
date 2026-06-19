function MetricPanel({ title, children }) {
    return (
        <div
            className="
            bg-slate-900
            rounded-xl
            border
            border-slate-800
            p-6
            hover:border-cyan-500
            hover:shadow-[0_0_20px_rgba(34,211,238,0.25)]
            transition-all
            duration-300
            "
        >
            <h2 className="text-xl font-semibold text-white mb-4">
                {title}
            </h2>

            {children}
        </div>
    );
}

export default MetricPanel;