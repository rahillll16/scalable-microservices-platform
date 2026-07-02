
function MetricPanel({ title, children }) {
    return (
        <div
            className="
                relative
                overflow-hidden
                rounded-3xl
                border
                border-slate-700/40
                bg-white/5
                backdrop-blur-xl
                p-6

                transition-all
                duration-500

                hover:-translate-y-2
                hover:border-cyan-400/50
                hover:shadow-[0_0_40px_rgba(34,211,238,0.18)]
            "
        >
            {/* Decorative Gradient */}
            <div
                className="
                    absolute
                    inset-0
                    bg-gradient-to-br
                    from-cyan-500/5
                    via-transparent
                    to-purple-500/5
                    pointer-events-none
                "
            />

            {/* Top Accent Line */}
            <div
                className="
                    absolute
                    top-0
                    left-0
                    w-full
                    h-[2px]
                    bg-gradient-to-r
                    from-cyan-400
                    via-blue-500
                    to-purple-500
                "
            />

            {/* Title */}
            <h2
                className="
                    relative
                    z-10

                    text-2xl
                    font-bold

                    text-transparent
                    bg-clip-text
                    bg-gradient-to-r
                    from-cyan-300
                    to-blue-400

                    mb-6
                "
            >
                {title}
            </h2>

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}

export default MetricPanel;
