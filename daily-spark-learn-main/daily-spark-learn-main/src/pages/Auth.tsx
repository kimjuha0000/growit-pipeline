import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";

export default function Auth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      alert(error.message);
    } else {
      alert("이메일로 로그인 링크를 보냈습니다!");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12">
        <div className="max-w-md mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로 가기
          </button>

          {/* Auth Card */}
          <div className="bg-card rounded-3xl p-8 md:p-10 border border-border">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2">
                {isSignUp ? "GrowIt 시작하기" : "다시 오셨군요!"}
              </h1>
              <p className="text-muted-foreground">
                {isSignUp 
                  ? "계정을 만들고 학습 기록을 저장하세요" 
                  : "로그인해서 이어서 학습하세요"
                }
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  이메일
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@example.com"
                  required
                  className={cn(
                    "w-full px-4 py-3 rounded-xl border-2 border-border bg-background",
                    "focus:outline-none focus:border-primary"
                  )}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(
                    "w-full px-4 py-3 rounded-xl border-2 border-border bg-background",
                    "focus:outline-none focus:border-primary"
                  )}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full mt-6"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    처리 중...
                  </span>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    {isSignUp ? "가입하기" : "로그인"}
                  </>
                )}
              </Button>
            </form>

            {/* Toggle */}
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {isSignUp ? "이미 계정이 있으신가요?" : "아직 계정이 없으신가요?"}{" "}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-primary font-medium hover:underline"
                >
                  {isSignUp ? "로그인" : "가입하기"}
                </button>
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">또는</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Social Login */}
            <Button variant="outline" size="lg" className="w-full" disabled>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google로 계속하기 (준비 중)
            </Button>

            {/* Privacy Note */}
            <p className="text-xs text-muted-foreground text-center mt-6">
              로그인하면 개인정보처리방침에 동의하는 것으로 간주합니다.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
