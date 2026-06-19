
function StatusCard({ title, value }) {

    const isUp = value === "UP";

    return (
        <div
            className={`
                rounded-xl
                p-5
                border
                text-center
                transition-all

                ${
                    isUp
                        ? "border-green-500 bg-green-500/10"
                        : "border-red-500 bg-red-500/10"
                }
            `}
        >
            <h3 className="text-gray-400 text-sm">
                {title}
            </h3>

            <p
                className={`
                    text-xl
                    font-bold
                    mt-2

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
    );
}

export default StatusCard;