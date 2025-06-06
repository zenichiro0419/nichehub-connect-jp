
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { mockCommunities } from '../data/mockData';
import { X } from 'lucide-react';
import { usePostActions } from '@/hooks/use-post-actions';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const PostForm: React.FC = () => {
  const [content, setContent] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const maxLength = 140;
  const { createPost, isSubmitting } = usePostActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && selectedCommunity) {
      try {
        console.log("投稿を作成します: ", { content: content.trim(), communityId: selectedCommunity });
        await createPost.mutateAsync({
          content: content.trim(),
          communityId: selectedCommunity,
        });
        setContent('');
        setSelectedCommunity('');
      } catch (error) {
        console.error('投稿エラー:', error);
        // エラーはuse-post-actions内のonErrorで処理されます
      }
    } else {
      toast({
        title: "投稿できません",
        description: "投稿内容とコミュニティの両方を選択してください",
        variant: "destructive",
      });
    }
  };

  const handleCommunitySelect = (communityId: string) => {
    console.log("コミュニティを選択:", communityId);
    setSelectedCommunity(communityId === selectedCommunity ? '' : communityId);
  };

  return (
    <div className="p-4 border-b">
      <form onSubmit={handleSubmit}>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, maxLength))}
          placeholder="何をシェアしますか？"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-niche-blue-300 resize-none"
          rows={3}
        />

        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-wrap gap-2">
            {mockCommunities.map(community => (
              <div
                key={community.id}
                onClick={() => handleCommunitySelect(community.id)}
                className={`flex items-center px-2 py-1 rounded-full text-sm cursor-pointer ${
                  selectedCommunity === community.id
                    ? `text-white ${community.color}`
                    : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <span className="mr-1">{community.icon}</span>
                <span>{community.name}</span>
                {selectedCommunity === community.id && (
                  <X size={14} className="ml-1 cursor-pointer" onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCommunity('');
                  }} />
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center">
            <div className={`mr-3 text-sm ${
              content.length > maxLength * 0.8 ? 'text-red-500' : 'text-gray-500'
            }`}>
              {content.length}/{maxLength}
            </div>
            <Button
              type="submit"
              disabled={!content.trim() || !selectedCommunity || content.length > maxLength || isSubmitting}
              className="bg-niche-blue-500 hover:bg-niche-blue-600"
            >
              {isSubmitting ? "投稿中..." : "投稿する"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
