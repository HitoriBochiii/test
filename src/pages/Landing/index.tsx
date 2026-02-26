import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Package,
  Shield,
  BarChart3,
  Users,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const LandingPage = () => {
  const [showFeatures, setShowFeatures] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <div className="relative flex-1 flex flex-col overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary-foreground/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />

        {/* Header */}
        <header className="relative z-10">
          <div className="max-w-8xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src="/public/PatraNiagaLogo.png"
                  alt="Logo Pertamina Patra Niaga"
                  className="h-14 w-auto object-contain rounded-md px-3 py-1"
                />
              </div>
              <div className="flex items-center gap-3">
                <Link to="/auth">
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/10"
                  >
                    Masuk
                  </Button>
                </Link>
                <Link to="/auth?mode=register">
                  <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                    Daftar
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Content - Centered */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
            <div className="max-w-3xl">
              <h1 className="text-4xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                Sistem Monitoring <br />
                <span className="text-secondary">Inventaris</span> Terintegrasi
              </h1>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Kelola dan pantau inventaris gudang Pertamina Patra Niaga secara
                real-time. Sistem terpadu untuk manajemen barang masuk, barang
                keluar, dan pelaporan.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/auth?mode=register">
                  <Button
                    size="lg"
                    className="bg-secondary hover:bg-secondary/90 text-secondary-foreground gap-2"
                  >
                    Mulai Sekarang
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 gap-2"
                  onClick={() => setShowFeatures(!showFeatures)}
                >
                  Pelajari Lebih Lanjut
                  {showFeatures ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section - Collapsible, inside hero for seamless background */}
        <div
          className={`relative z-10 overflow-hidden transition-all duration-500 ease-in-out ${
            showFeatures ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 pb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Fitur Unggulan
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Solusi lengkap untuk manajemen inventaris dengan fitur-fitur
                canggih
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Package,
                  title: "Manajemen Barang",
                  description:
                    "Kelola barang masuk dan keluar dengan mudah dan terorganisir",
                },
                {
                  icon: BarChart3,
                  title: "Laporan Real-time",
                  description:
                    "Dashboard interaktif dengan visualisasi data yang komprehensif",
                },
                {
                  icon: Shield,
                  title: "Keamanan Data",
                  description:
                    "Sistem autentikasi dan enkripsi untuk melindungi data Anda",
                },
                {
                  icon: Users,
                  title: "Multi-pengguna",
                  description:
                    "Akses berbasis peran untuk kolaborasi tim yang efisien",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/70">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
