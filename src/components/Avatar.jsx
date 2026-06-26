import { getInitials } from "../utils/helpers";

const sizeClasses = {
  sm: "w-9 h-9 text-xs",
  md: "w-11 h-11 text-sm",
  lg: "w-16 h-16 text-lg",
  xl: "w-24 h-24 text-2xl",
};

const Avatar = ({ src, name, size = "md", isOnline, showStatus = false, isGroup = false }) => {
  const dimensions = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`relative flex-shrink-0 ${dimensions}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${dimensions} rounded-full object-cover ring-2 ring-white dark:ring-surface-darkPanel`}
        />
      ) : (
        <div
          className={`${dimensions} rounded-full flex items-center justify-center font-semibold text-white bg-gradient-to-br from-accent-400 to-accent-600 ring-2 ring-white dark:ring-surface-darkPanel`}
        >
          {isGroup ? "👥" : getInitials(name)}
        </div>
      )}
      {showStatus && (
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white dark:ring-surface-darkPanel ${
            isOnline ? "bg-accent-500" : "bg-gray-400 dark:bg-gray-600"
          }`}
        />
      )}
    </div>
  );
};

export default Avatar;
