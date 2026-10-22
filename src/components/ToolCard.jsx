import { Link } from "react-router-dom";

export default function ToolCard({
    icon,
    title,
    description,
    to,
    accent = "purple",
}) {
    return (
        <Link
            to={to}
            className={`tool-card tool-card-${accent}`}
        >
            <div className="tool-card-icon">
                {icon}
            </div>

            <div className="tool-card-content">
                <h3>{title}</h3>
                <p>{description}</p>

                <span className="tool-card-link">
                    Open tool →
                </span>
            </div>
        </Link>
    );
}