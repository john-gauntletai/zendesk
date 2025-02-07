import { useState } from "react";
import { format } from "date-fns";
import SettingsPageLayout from "./SettingsPageLayout";
import { useUserStore, useSessionStore, useRolesStore, useTeamsStore } from "../../store";
import Avatar from "../__shared/Avatar";
import { toast } from "react-hot-toast";
import supabase from "../../supabase";
import InviteTeammatesModal from "./InviteTeammatesModal";

const Teammates = () => {
  const { users, fetchUsers } = useUserStore();
  const { session } = useSessionStore();
  const { roles } = useRolesStore();
  const { teams } = useTeamsStore();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Check if current user is admin
  const isAdmin =
    users.find((u) => u.id === session?.id)?.role_id ===
    roles.find((r) => r.name.toLowerCase() === "admin")?.id;

  // Sort users by created_at in descending order
  const sortedUsers = [...users].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const handleRoleChange = async (userId: string, newRoleId: string) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ role_id: newRoleId })
        .eq("id", userId);

      if (error) throw error;

      await fetchUsers();
      toast.success("Role updated successfully");
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    }
  };

  const handleInviteTeammates = async (emails: string[]) => {
    try {
      const agentRole = roles.find((r) => r.name.toLowerCase() === "agent");
      if (!agentRole) throw new Error("Agent role not found");

      for (const email of emails) {
        // Invite user through Supabase Auth
        const { data: authUser, error: inviteError } =
          await supabase.functions.invoke("invite-teammate", {
            body: {
              email,
              org_id: session?.org_id,
              role_id: agentRole.id,
              redirectTo: `${window.location.origin}/new-user-reset-password`,
            },
          });

        if (inviteError) throw inviteError;
      }

      toast.success(
        `Successfully invited ${emails.length} teammate${
          emails.length === 1 ? "" : "s"
        }`
      );
    } catch (error) {
      console.error("Error inviting teammates:", error);
      toast.error(`Failed to invite teammates`);
      throw error;
    }
  };

  return (
    <SettingsPageLayout
      title="Teammates"
      actions={
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setIsInviteModalOpen(true)}
          disabled={!isAdmin}
        >
          Invite Teammates
        </button>
      }
    >
      <div className="card bg-base-100 shadow-md rounded-lg border-2 border-base-300">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Joined</th>
                  <th>Teams</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((user) => {
                  const userTeams = teams.filter(team => 
                    team.users?.some(u => u.id === user.id)
                  );

                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <Avatar user={user} size={32} />
                          <span>{user.full_name}</span>
                        </div>
                      </td>
                      <td className="text-base-content/70">{user.email}</td>
                      <td className="text-base-content/70">
                        {format(new Date(user.created_at), "MMM d, yyyy")}
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-2">
                          {userTeams.map(team => (
                            <div 
                              key={team.id}
                              className="flex items-center gap-1.5 px-2 py-1 bg-base-200 rounded-full text-sm"
                            >
                              <span className="w-5 h-5 flex items-center justify-center bg-base-100 rounded-full">
                                {team.emoji_icon}
                              </span>
                              <span>{team.name}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td>
                        {isAdmin && user.id !== session?.id ? (
                          <select
                            className="select select-sm select-bordered"
                            value={user.role_id}
                            onChange={(e) =>
                              handleRoleChange(user.id, e.target.value)
                            }
                          >
                            {roles.map((role) => (
                              <option key={role.id} value={role.id}>
                                {role.name.charAt(0).toUpperCase() +
                                  role.name.slice(1)}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-base-content/70">
                            {(
                              roles.find((r) => r.id === user.role_id)?.name || ""
                            )
                              .charAt(0)
                              .toUpperCase() +
                              (
                                roles.find((r) => r.id === user.role_id)?.name ||
                                ""
                              ).slice(1)}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center text-base-content/60 py-4"
                    >
                      No teammates found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <InviteTeammatesModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSubmit={handleInviteTeammates}
      />
    </SettingsPageLayout>
  );
};

export default Teammates;
