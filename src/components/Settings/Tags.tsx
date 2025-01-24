import { useState } from "react";
import { format } from "date-fns";
import SettingsPageLayout from "./SettingsPageLayout";
import { useTagsStore, useUserStore, useSessionStore } from "../../store";
import AddTagModal from "./AddTagModal";
import EditTagModal from "./EditTagModal";
import supabase from "../../supabase";
import { toast } from "react-hot-toast";
import { Tag } from "../../types";
import DeleteTagModal from "./DeleteTagModal";
import Avatar from "../__shared/Avatar";

const Tags = () => {
  const { tags, fetchTags } = useTagsStore();
  const { users } = useUserStore();
  const { session } = useSessionStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [deletingTag, setDeletingTag] = useState<Tag | null>(null);

  const handleCreateTag = async (tagData: {
    name: string;
    background_color: string;
    text_color: string;
  }) => {
    try {
      const { error } = await supabase.from('tags').insert({
        ...tagData,
        org_id: session?.org_id,
        created_by: session?.id,
      });

      if (error) throw error;

      await fetchTags();
      toast.success('Tag created successfully');
    } catch (error) {
      console.error('Error creating tag:', error);
      toast.error('Failed to create tag');
    }
  };

  const handleEditTag = async (tagId: string, updates: {
    name: string;
    background_color: string;
    text_color: string;
  }) => {
    try {
      const { error } = await supabase
        .from('tags')
        .update(updates)
        .eq('id', tagId);

      if (error) throw error;

      await fetchTags();
      toast.success('Tag updated successfully');
      setEditingTag(null);
    } catch (error) {
      console.error('Error updating tag:', error);
      toast.error('Failed to update tag');
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId);

      if (error) throw error;

      await fetchTags();
      toast.success('Tag deleted successfully');
      setDeletingTag(null);
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast.error('Failed to delete tag');
    }
  };

  const sortedTags = [...tags].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <SettingsPageLayout 
      title="Tags"
      actions={
        <button 
          className="btn btn-primary btn-sm"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Add Tag
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
                  <th>Created</th>
                  <th>Created By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedTags.map(tag => {
                  const creator = users.find(u => u.id === tag.created_by);
                  return (
                    <tr key={tag.id}>
                      <td>
                        <div className="flex items-center">
                          <span 
                            className="px-2 py-1 rounded text-sm truncate max-w-[200px]"
                            style={{
                              backgroundColor: tag.background_color,
                              color: tag.text_color,
                            }}
                          >
                            {tag.name}
                          </span>
                        </div>
                      </td>
                      <td className="text-sm text-base-content/70">
                        {format(new Date(tag.created_at), 'MMM d, yyyy')}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Avatar user={creator} size={24} />
                          <span className="text-sm text-base-content/70">
                            {creator?.full_name || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <button 
                          className="btn btn-ghost btn-xs"
                          onClick={() => setEditingTag(tag)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-ghost btn-xs text-error"
                          onClick={() => setDeletingTag(tag)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {tags.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center text-base-content/60 py-4">
                      No tags found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddTagModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTag}
      />

      {editingTag && (
        <EditTagModal
          isOpen={true}
          onClose={() => setEditingTag(null)}
          onSubmit={handleEditTag}
          tag={editingTag}
        />
      )}

      {deletingTag && (
        <DeleteTagModal
          isOpen={true}
          onClose={() => setDeletingTag(null)}
          onConfirm={handleDeleteTag}
          tag={deletingTag}
        />
      )}
    </SettingsPageLayout>
  );
};

export default Tags; 