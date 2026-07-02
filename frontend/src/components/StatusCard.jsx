
function StatusCard({ title, value }) {
    const isUp = value === "UP";

    return (
        <div
            className={`
                relative
                overflow-hidden
                rounded-3xl
                p-6
                border
                backdrop-blur-xl
                transition-all
                duration-500
                hover:-translate-y-2
                hover:scale-[1.02]
                cursor-pointer
                group

                ${
                    isUp
                        ? `
                            border-green-500/30
                            bg-green-500/5
                            hover:shadow-[0_0_35px_rgba(34,197,94,0.35)]
                          `
                        : `
                            border-red-500/30
                            bg-red-500/5
                            hover:shadow-[0_0_35px_rgba(239,68,68,0.35)]
                          `
                }
            `}
        >
            {/* Background Glow */}
            <div
                className={`
                    absolute
                    inset-0
                    opacity-40
                    transition-all
                    duration-500
                    group-hover:opacity-70

                    ${
                        isUp
                            ? "bg-gradient-to-br from-green-500/10 to-emerald-500/5"
                            : "bg-gradient-to-br from-red-500/10 to-rose-500/5"
                    }
                `}
            />

            {/* Title */}
            <div className="relative z-10">
                <h3
                    className="
                        text-slate-400
                        uppercase
                        tracking-widest
                        text-xs
                        font-semibold
                    "
                >
                    {title}
                </h3>

                {/* Status */}
                <div className="mt-5 flex items-center justify-center gap-3">

                    <span
                        className={`
                            w-3
                            h-3
                            rounded-full
                            animate-pulse

                            ${
                                isUp
                                    ? "bg-green-500"
                                    : "bg-red-500"
                            }
                        `}
                    />

                    <p
                        className={`
                            text-3xl
                            font-extrabold

                            ${
                                isUp
                                    ? "text-green-400"
                                    : "text-red-400"
                            }
                        `}
                    >
                        {value}
                    </p>

                </div>
            </div>
        </div>
    );
}

export default StatusCard;
