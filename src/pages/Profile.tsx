
import React from "react";
import { useForm } from "react-hook-form";
import { Camera, User } from "lucide-react";
import { useProfile, Profile } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { AuthGuard } from "@/components/AuthGuard";
import NavMenu from "@/components/NavMenu";

const ProfilePage: React.FC = () => {
  const { profile, isLoading, updateProfile, uploadAvatar, isSubmitting } = useProfile();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<Partial<Profile>>({
    defaultValues: {
      username: profile?.username || "",
      display_name: profile?.display_name || "",
      bio: profile?.bio || "",
    },
  });

  // プロフィールデータが読み込まれたらフォームを更新
  React.useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username,
        display_name: profile.display_name || "",
        bio: profile.bio || "",
      });
    }
  }, [profile, form]);

  // フォーム送信
  const onSubmit = (data: Partial<Profile>) => {
    updateProfile.mutate(data);
  };

  // アバター画像選択時の処理
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadAvatar.mutate(file);
    }
  };

  // アバター画像クリック時の処理
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // ユーザー名のイニシャルを取得
  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-niche-blue-500"></div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        {/* サイドバー */}
        <div className="w-64 border-r">
          <NavMenu />
        </div>
        
        {/* メインコンテンツ */}
        <div className="flex-1 p-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>プロフィール設定</CardTitle>
              <CardDescription>
                プロフィール情報の確認と変更ができます。
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {/* アバター画像 */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Avatar className="w-24 h-24 cursor-pointer" onClick={handleAvatarClick}>
                    <AvatarImage 
                      src={profile?.avatar_url || ''} 
                      alt={profile?.display_name || 'ユーザー'} 
                    />
                    <AvatarFallback className="text-2xl">
                      {getInitials(profile?.display_name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 cursor-pointer"
                       onClick={handleAvatarClick}>
                    <Camera size={16} />
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
              
              {/* プロフィールフォーム */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ユーザーネーム</FormLabel>
                        <FormControl>
                          <Input placeholder="ユーザーネーム" {...field} />
                        </FormControl>
                        <FormDescription>
                          あなたのユーザーIDとして使用されます
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="display_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>表示名</FormLabel>
                        <FormControl>
                          <Input placeholder="表示名" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormDescription>
                          コミュニティ内で表示される名前です
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>自己紹介</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="自己紹介文を入力してください" 
                            className="h-24 resize-none"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? '更新中...' : '保存する'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
};

export default ProfilePage;
