import { useState, useRef, useEffect } from "react";
import SettingsPageLayout from "./SettingsPageLayout";
import { useTeamsStore, useSessionStore, useUserStore } from "../../store";
import Avatar from "../__shared/Avatar";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { toast } from "react-hot-toast";
import { PlusIcon, CheckIcon } from "@heroicons/react/24/outline";

const Teams = () => {
  const { teams, createTeam, addUserToTeam, removeUserFromTeam, updateTeam, removeTeam } = useTeamsStore();
  const { users } = useUserStore();
  const { session } = useSessionStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [deletingTeam, setDeletingTeam] = useState<Team | null>(null);
  const [newTeamName, setNewTeamName] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("👥");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMembersDropdown, setShowMembersDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowMembersDropdown(null);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleUserInTeam = async (teamId: string, userId: string) => {
    const team = teams.find(t => t.id === teamId);
    const isUserInTeam = team?.users?.some(u => u.id === userId);

    if (isUserInTeam) {
      await removeUserFromTeam(teamId, userId);
    } else {
      await addUserToTeam(teamId, userId);
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      toast.error("Please enter a team name");
      return;
    }

    setIsSubmitting(true);
    try {
      await createTeam({
        name: newTeamName.trim(),
        emoji_icon: selectedEmoji,
        org_id: session!.org_id,
      });

      setIsCreateModalOpen(false);
      setNewTeamName("");
      setSelectedEmoji("👥");
      toast.success("Team created successfully");
    } catch (error) {
      console.error("Error creating team:", error);
      toast.error("Failed to create team");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (team: Team) => {
    setEditingTeam(team);
    setNewTeamName(team.name);
    setSelectedEmoji(team.emoji_icon);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (team: Team) => {
    setDeletingTeam(team);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateTeam = async () => {
    if (!editingTeam) return;
    if (!newTeamName.trim()) {
      toast.error("Please enter a team name");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateTeam({
        id: editingTeam.id,
        name: newTeamName.trim(),
        emoji_icon: selectedEmoji,
      });

      setIsEditModalOpen(false);
      setEditingTeam(null);
      setNewTeamName("");
      setSelectedEmoji("👥");
      toast.success("Team updated successfully");
    } catch (error) {
      console.error("Error updating team:", error);
      toast.error("Failed to update team");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!deletingTeam) return;

    setIsSubmitting(true);
    try {
      await removeTeam(deletingTeam.id);
      setIsDeleteModalOpen(false);
      setDeletingTeam(null);
      toast.success("Team deleted successfully");
    } catch (error) {
      console.error("Error deleting team:", error);
      toast.error("Failed to delete team");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SettingsPageLayout 
      title="Teams"
      actions={
        <button 
          className="btn btn-primary btn-sm"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Team
        </button>
      }
    >
      <div className="card bg-base-100 shadow-md rounded-lg border-2 border-base-300">
        <div className="card-body">
          <div className="overflow-visible">
            <table className="table">
              <thead>
                <tr>
                  <th>Team</th>
                  <th>Members</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teams.map(team => (
                  <tr key={team.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{team.emoji_icon}</span>
                        <span className="font-medium">{team.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2 overflow-hidden">
                          {team.users?.slice(0, 3).map(user => {
                            return (
                              <div key={user.id} className="inline-block">
                                <Avatar withBorder user={user} size={24} />
                              </div>
                            )
                          })}
                          {(team.users?.length || 0) > 3 && (
                            <div className="inline-flex z-50 items-center justify-center w-6 h-6 rounded-full bg-base-300 text-xs">
                              +{team.users!.length - 3}
                            </div>
                          )}
                        </div>
                        <div className="relative">
                          <button
                            className="btn btn-ghost btn-sm btn-circle"
                            onClick={() => {
                              setShowMembersDropdown(team.id);
                              setSearchQuery("");
                            }}
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                          
                          {showMembersDropdown === team.id && (
                            <div 
                              ref={dropdownRef}
                              className="absolute z-50 mt-2 w-64 bg-base-100 rounded-lg shadow-lg border border-base-300"
                            >
                              <div className="p-2">
                                <input
                                  type="text"
                                  placeholder="Search users..."
                                  className="input input-sm input-bordered w-full"
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  autoFocus
                                />
                              </div>
                              <div className="max-h-64 overflow-y-auto">
                                {filteredUsers.map(user => {
                                  const isSelected = team.users?.some(u => u.id === user.id);
                                  return (
                                    <button
                                      key={user.id}
                                      onClick={() => handleToggleUserInTeam(team.id, user.id)}
                                      className="w-full px-3 py-2 hover:bg-base-200 flex items-center gap-2 justify-between"
                                    >
                                      <div className="flex items-center gap-2">
                                        <Avatar user={user} size={24} />
                                        <div className="text-left">
                                          <div className="text-sm font-medium">{user.full_name}</div>
                                          <div className="text-xs text-base-content/70">{user.email}</div>
                                        </div>
                                      </div>
                                      {isSelected && (
                                        <CheckIcon className="w-4 h-4 text-success" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <button 
                        className="btn btn-ghost btn-xs"
                        onClick={() => handleEditClick(team)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-ghost btn-xs text-error"
                        onClick={() => handleDeleteClick(team)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {teams.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center text-base-content/60 py-4">
                      No teams found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Team Modal */}
      {isCreateModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box !overflow-visible">
            <h3 className="font-bold text-lg mb-4">Create New Team</h3>
            
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Team Icon</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  className="text-3xl p-2 hover:bg-base-200 rounded-lg relative"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  {selectedEmoji}
                </button>
                <span className="text-sm text-base-content/70">
                  Click to change icon
                </span>
              </div>
              
              {showEmojiPicker && (
                <div className="absolute z-50 left-20">
                  <Picker
                    data={data}
                    onEmojiSelect={(emoji: any) => {
                      setSelectedEmoji(emoji.native);
                      setShowEmojiPicker(false);
                    }}
                    theme={document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'}
                  />
                </div>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Team Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter team name"
                className="input input-bordered"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
            </div>

            <div className="modal-action">
              <button 
                className="btn btn-ghost" 
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setNewTeamName("");
                  setSelectedEmoji("👥");
                  setShowEmojiPicker(false);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCreateTeam}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner" />
                    Creating...
                  </>
                ) : (
                  'Create Team'
                )}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => {
            setIsCreateModalOpen(false);
            setShowEmojiPicker(false);
          }}>
            <button className="cursor-default">Close</button>
          </div>
        </div>
      )}

      {/* Edit Team Modal */}
      {isEditModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box !overflow-visible">
            <h3 className="font-bold text-lg mb-4">Edit Team</h3>
            
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Team Icon</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  className="text-3xl p-2 hover:bg-base-200 rounded-lg relative"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  {selectedEmoji}
                </button>
                <span className="text-sm text-base-content/70">
                  Click to change icon
                </span>
              </div>
              
              {showEmojiPicker && (
                <div className="absolute z-50 left-20">
                  <Picker
                    data={data}
                    onEmojiSelect={(emoji: any) => {
                      setSelectedEmoji(emoji.native);
                      setShowEmojiPicker(false);
                    }}
                    theme={document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'}
                  />
                </div>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Team Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter team name"
                className="input input-bordered"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
            </div>

            <div className="modal-action">
              <button 
                className="btn btn-ghost" 
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingTeam(null);
                  setNewTeamName("");
                  setSelectedEmoji("👥");
                  setShowEmojiPicker(false);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleUpdateTeam}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner" />
                    Updating...
                  </>
                ) : (
                  'Update Team'
                )}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => {
            setIsEditModalOpen(false);
            setShowEmojiPicker(false);
          }}>
            <button className="cursor-default">Close</button>
          </div>
        </div>
      )}

      {/* Delete Team Modal */}
      {isDeleteModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Delete Team</h3>
            <p>Are you sure you want to delete the team "{deletingTeam?.name}"? This action cannot be undone.</p>
            
            <div className="modal-action">
              <button 
                className="btn btn-ghost" 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeletingTeam(null);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={handleDeleteTeam}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner" />
                    Deleting...
                  </>
                ) : (
                  'Delete Team'
                )}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setIsDeleteModalOpen(false)}>
            <button className="cursor-default">Close</button>
          </div>
        </div>
      )}
    </SettingsPageLayout>
  );
};

export default Teams; 