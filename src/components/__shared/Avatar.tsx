import { useState, useRef, useEffect } from "react";
import { User } from "../../types";
import Portal from "../Portal";
import { useRolesStore } from "../../store";
import Avvvatars from "avvvatars-react";

interface AvatarProps {
  user: User | undefined;
  size?: number;
  showTooltip?: boolean;
  withBorder?: boolean;
}

const Avatar = ({ user, size = 32, showTooltip = true, withBorder = false }: AvatarProps) => {
  const [showInfo, setShowInfo] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const avatarRef = useRef<HTMLDivElement>(null);
  const { roles } = useRolesStore();

  useEffect(() => {
    const updatePosition = () => {
      if (avatarRef.current) {
        const rect = avatarRef.current.getBoundingClientRect();
        setTooltipPosition({
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX - 100 + rect.width / 2,
        });
      }
    };

    if (showInfo) {
      updatePosition();
      document.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
    }

    return () => {
      document.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [showInfo]);

  const userRole = roles.find(r => r.id === user?.role_id);

  return (
    <>
      <div
        ref={avatarRef}
        onMouseEnter={() => showTooltip && setShowInfo(true)}
        onMouseLeave={() => setShowInfo(false)}
        className="relative"
      >
        {user?.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.full_name}
            className={`rounded-full object-cover ${withBorder ? "border-2 border-base-100" : ""}`}
            style={{ width: size, height: size }}
          />
        ) : (
          <Avvvatars
            value={user?.full_name || user?.email || "?"}
            border={withBorder}
            borderColor={withBorder ? "#ffffff" : 'transparent'}
            borderSize={withBorder ? 2 : 0}
            size={size}
          />
        )}
      </div>

      {showInfo && user && showTooltip && (
        <Portal>
          <div
            style={{
              position: 'absolute',
              top: tooltipPosition.top,
              left: tooltipPosition.left,
            }}
            className="z-50 w-52 bg-base-100 rounded-lg shadow-lg border border-base-300 p-3"
          >
            <div className="flex items-center gap-3">
              <Avatar user={user} size={40} showTooltip={false} />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{user.full_name}</div>
                <div className="text-sm text-base-content/70 truncate">{user.email}</div>
                {userRole && (
                  <div className="text-xs text-base-content/50 capitalize">{userRole.name}</div>
                )}
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
};

export default Avatar; 