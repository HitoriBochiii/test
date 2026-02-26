import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Kata sandi minimal 6 karakter"),
});

const registerSchema = z.object({
  fullName: z.string().min(2, "Nama lengkap minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Kata sandi minimal 6 karakter"),
});

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(
    searchParams.get("mode") !== "register",
  );
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    setIsLogin(searchParams.get("mode") !== "register");
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      if (isLogin) {
        const result = loginSchema.safeParse(formData);
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) {
              fieldErrors[err.path[0] as string] = err.message;
            }
          });
          setErrors(fieldErrors);
          setLoading(false);
          return;
        }

        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toast({
            title: "Gagal Masuk",
            description:
              error.message === "Invalid login credentials"
                ? "Email atau kata sandi salah"
                : error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Berhasil Masuk",
            description: "Selamat datang kembali!",
          });
          navigate("/dashboard");
        }
      } else {
        const result = registerSchema.safeParse(formData);
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) {
              fieldErrors[err.path[0] as string] = err.message;
            }
          });
          setErrors(fieldErrors);
          setLoading(false);
          return;
        }

        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.fullName,
        );

        if (error) {
          toast({
            title: "Gagal Mendaftar",
            description:
              error.message === "User already registered"
                ? "Email sudah terdaftar"
                : error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Pendaftaran Berhasil",
            description: "Akun Anda telah dibuat. Silakan masuk.",
          });
          navigate("/dashboard");
        }
      }
    } catch (err) {
      toast({
        title: "Terjadi Kesalahan",
        description: "Silakan coba lagi nanti.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />

        <div className="relative z-10 flex flex-col justify-center p-12">
          <div className="flex items-center justify-left mb-12">
            <img
              src="/public/PatraNiagaLogo.png"
              alt="Logo Pertamina Patra Niaga"
              className="h-20 w-auto object-contain rounded-lg px-4 py-2"
            />
          </div>

          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Sistem Monitoring <br />
            Inventaris Terpadu
          </h2>
          <p className="text-lg text-white/80 leading-relaxed max-w-md">
            Kelola inventaris gudang dengan mudah. Pantau barang masuk dan
            keluar secara real-time dengan dashboard yang intuitif.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {isLogin ? "Masuk" : "Daftar Akun"}
            </h1>
            <p className="text-muted-foreground">
              {isLogin
                ? "Masukkan kredensial Anda untuk mengakses sistem"
                : "Buat akun baru untuk mulai menggunakan sistem"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Nama Lengkap</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Masukkan nama lengkap"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={errors.fullName ? "border-destructive" : ""}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nama@pertamina.com"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "border-destructive" : ""}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isLogin ? "Masuk" : "Daftar"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-semibold hover:underline"
              >
                {isLogin ? "Daftar" : "Masuk"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
