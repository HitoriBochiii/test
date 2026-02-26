import { useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Lock, Save } from 'lucide-react';
import { z } from 'zod';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
  phone: z.string().optional(),
  division: z.string().optional(),
  job_title: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Kata sandi minimal 6 karakter'),
  newPassword: z.string().min(6, 'Kata sandi baru minimal 6 karakter'),
  confirmPassword: z.string().min(6, 'Konfirmasi kata sandi minimal 6 karakter'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Kata sandi tidak cocok',
  path: ['confirmPassword'],
});

const SettingsPage = () => {
  const { profile, user, updateProfile, updatePassword } = useAuth();
  const { toast } = useToast();

  const [profileData, setProfileData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    division: profile?.division || '',
    job_title: profile?.job_title || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = profileSchema.safeParse(profileData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setProfileLoading(true);
    try {
      const { error } = await updateProfile(profileData);
      if (error) {
        toast({
          title: 'Gagal Menyimpan',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Berhasil',
          description: 'Profil berhasil diperbarui.',
        });
      }
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = passwordSchema.safeParse(passwordData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setPasswordLoading(true);
    try {
      const { error } = await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      if (error) {
        toast({
          title: 'Gagal Mengubah Kata Sandi',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Berhasil',
          description: 'Kata sandi berhasil diubah.',
        });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pengaturan</h1>
          <p className="text-muted-foreground">Kelola profil dan keamanan akun Anda</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="password" className="gap-2">
              <Lock className="w-4 h-4" />
              Kata Sandi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Profil</CardTitle>
                <CardDescription>
                  Perbarui informasi profil Anda. Perubahan akan langsung tersimpan.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        Email tidak dapat diubah
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="full_name">Nama Lengkap</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        value={profileData.full_name}
                        onChange={handleProfileChange}
                        placeholder="Masukkan nama lengkap"
                        className={errors.full_name ? 'border-destructive' : ''}
                      />
                      {errors.full_name && (
                        <p className="text-sm text-destructive">{errors.full_name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Nomor Telepon</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        placeholder="08xxxxxxxxxx"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="division">Divisi</Label>
                      <Input
                        id="division"
                        name="division"
                        value={profileData.division}
                        onChange={handleProfileChange}
                        placeholder="Contoh: IT, Logistik"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="job_title">Jabatan</Label>
                      <Input
                        id="job_title"
                        name="job_title"
                        value={profileData.job_title}
                        onChange={handleProfileChange}
                        placeholder="Contoh: Staff, Manager"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={profileLoading} className="gap-2">
                      {profileLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Simpan Perubahan
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Ubah Kata Sandi</CardTitle>
                <CardDescription>
                  Pastikan kata sandi baru Anda aman dan mudah diingat.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Kata Sandi Saat Ini</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Masukkan kata sandi saat ini"
                        className={errors.currentPassword ? 'border-destructive' : ''}
                      />
                      {errors.currentPassword && (
                        <p className="text-sm text-destructive">{errors.currentPassword}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Kata Sandi Baru</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Masukkan kata sandi baru"
                        className={errors.newPassword ? 'border-destructive' : ''}
                      />
                      {errors.newPassword && (
                        <p className="text-sm text-destructive">{errors.newPassword}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi Baru</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Ulangi kata sandi baru"
                        className={errors.confirmPassword ? 'border-destructive' : ''}
                      />
                      {errors.confirmPassword && (
                        <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={passwordLoading} className="gap-2">
                      {passwordLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                      Ubah Kata Sandi
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
