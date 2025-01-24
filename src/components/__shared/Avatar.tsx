import Avvvatars from "avvvatars-react";

interface AvatarProps {
  user?: {
    avatar_url?: string | null;
    full_name?: string | null;
    email?: string | null;
  };
  size?: number;
}

const Avatar = ({ user = {}, size = 40 }: AvatarProps) => {
  if (user.avatar_url) {
    return (
      <div className="avatar">
        <div 
          className="rounded-full"
          style={{ width: size, height: size }}
        >
          <img
            src={user.avatar_url}
            alt={user.full_name || user.email || "User avatar"}
            onError={(e) => {
              e.currentTarget.onerror = null; // Prevent infinite loop
              e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.full_name || user.email || "?"}`; 
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <Avvvatars 
      value={user.full_name || user.email} 
      size={size} 
    />
  );
};

export default Avatar; 