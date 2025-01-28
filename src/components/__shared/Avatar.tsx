import { useState, useRef, useEffect } from "react";
import { User } from "../../types";
import Portal from "../Portal";
import { useRolesStore, useTeamsStore } from "../../store";
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
  const { teams } = useTeamsStore();

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
  const userTeams = teams.filter(team => team.users?.some(u => u.id === user?.id));

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
            className="z-50 w-64 bg-base-100 rounded-lg shadow-lg border border-base-300 p-3"
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
            {userTeams.length > 0 && (
              <div className="mt-3 border-t border-base-200 pt-3">
                <div className="text-xs text-base-content/50 mb-1.5">Teams</div>
                <div className="flex flex-wrap gap-1.5">
                  {userTeams.map(team => (
                    <div 
                      key={team.id}
                      className="flex items-center gap-1 px-2 py-1 bg-base-200 rounded-full text-xs"
                    >
                      <span className="w-4 h-4 flex items-center justify-center bg-base-100 rounded-full">
                        {team.emoji_icon}
                      </span>
                      <span>{team.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Portal>
      )}
    </>
  );
};

export default Avatar; 