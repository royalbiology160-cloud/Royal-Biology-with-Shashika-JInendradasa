import Link from "next/link";
import {
  BookOpen,
  Video,
  FileText,
  Award,
  Users,
  Brain,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-royal-bg">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-royal-primary/10 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-royal-primary text-white font-bold text-lg">
              RB
            </div>
            <div>
              <span className="text-lg font-bold text-royal-dark">Royal Biology</span>
              <p className="text-[10px] text-royal-primary/70 -mt-0.5">2027 Revision</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-royal-text md:flex">
            <Link href="/" className="hover:text-royal-primary transition">මුල් පිටුව</Link>
            <Link href="#about" className="hover:text-royal-primary transition">අප ගැන</Link>
            <Link href="#class" className="hover:text-royal-primary transition">2027 Revision</Link>
            <Link href="#announcements" className="hover:text-royal-primary transition">නිවේදන</Link>
            <Link href="#contact" className="hover:text-royal-primary transition">සම්බන්ධ වන්න</Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/login" className="btn-secondary text-sm px-4 py-2">
              Login
            </Link>
            <Link href="/register" className="btn-primary text-sm px-4 py-2">
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-royal-light via-white to-royal-bg" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:flex lg:items-center lg:gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-royal-primary/10 px-3 py-1 text-xs font-medium text-royal-primary">
              <span className="h-2 w-2 rounded-full bg-royal-primary animate-pulse" />
              2027 A/L Biology Revision
            </div>
            <h1 className="text-3xl font-bold leading-tight text-royal-dark sm:text-4xl lg:text-5xl">
              ඔබේ Biology සිහිනය
              <br />
              <span className="text-royal-primary">Royal Biology</span> සමඟ
            </h1>
            <p className="max-w-xl text-base text-royal-text/80 sm:text-lg">
              ශ්‍රී ලංකාවේ G.C.E. Advanced Level Biology සිසුන් සඳහා නිර්මාණය කළ
              premium online අධ්‍යාපන වේදිකාව. Live පන්ති, Recorded පාඩම්, Online
              විභාග, AI Tutor සහ තවත් බොහෝ දේ.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/register" className="btn-primary gap-2 text-base px-6 py-3">
                2027 Revision පන්තියට සම්බන්ධ වන්න
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#class" className="btn-secondary gap-2 text-base px-6 py-3">
                වැඩිදුර දැනගන්න
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 pt-4 text-sm text-royal-text/70">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-royal-primary" />
                Live Classes
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-royal-primary" />
                Recorded Lessons
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-royal-primary" />
                Online Exams
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-royal-primary" />
                AI Biology Tutor
              </div>
            </div>
          </div>

          <div className="mt-10 flex-1 lg:mt-0">
            <div className="relative mx-auto max-w-md">
              <div className="card overflow-hidden p-0 shadow-xl">
                <div className="bg-gradient-to-br from-royal-primary to-royal-dark p-6 text-white">
                  <p className="text-sm opacity-90">2027 Revision</p>
                  <h3 className="mt-1 text-2xl font-bold">Biology Masterclass</h3>
                  <p className="mt-2 text-sm opacity-80">
                    සම්පූර්ණ syllabus + Revision + Paper Discussions
                  </p>
                </div>
                <div className="space-y-3 p-5">
                  {[
                    { icon: Video, label: "Live & Recorded Classes" },
                    { icon: FileText, label: "Notes, Tutes & Past Papers" },
                    { icon: Award, label: "Online Exams & Leaderboard" },
                    { icon: Brain, label: "AI Biology Tutor (Sinhala)" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-royal-light">
                        <item.icon className="h-4 w-4 text-royal-primary" />
                      </div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="class" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-royal-dark sm:text-3xl">
            2027 Revision පන්තියේ විශේෂාංග
          </h2>
          <p className="mt-2 text-royal-text/70">
            එකම පන්තිය – සම්පූර්ණ Biology අත්දැකීම
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Video,
              title: "Live Classes",
              desc: "Zoom / YouTube Live හරහා සජීවී පන්ති. Join Now බොත්තමෙන් කෙලින්ම සම්බන්ධ වන්න.",
            },
            {
              icon: BookOpen,
              title: "Recorded Lessons",
              desc: "Chapter-wise recorded පාඩම්. Payment active වූ විට පමණක් access. Resume watching සහාය.",
            },
            {
              icon: FileText,
              title: "Notes & Tutes",
              desc: "Theory notes, Short notes, MCQ papers, Model papers, Past papers – PDF ලෙස.",
            },
            {
              icon: Award,
              title: "Online Exams",
              desc: "MCQ, Structured, Model papers. Auto marking + Results + Leaderboard.",
            },
            {
              icon: Brain,
              title: "AI Biology Tutor",
              desc: "Sinhala භාෂාවෙන් Biology ප්‍රශ්න විසඳීම, summaries, terminology.",
            },
            {
              icon: Users,
              title: "Progress Tracking",
              desc: "Attendance, Learning progress, Achievements සහ Notifications.",
            },
          ].map((f) => (
            <div key={f.title} className="card group transition hover:shadow-lg hover:border-royal-primary/20">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-royal-light group-hover:bg-royal-primary/15 transition">
                <f.icon className="h-5 w-5 text-royal-primary" />
              </div>
              <h3 className="font-semibold text-royal-dark">{f.title}</h3>
              <p className="mt-1.5 text-sm text-royal-text/70 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About / Teacher */}
      <section id="about" className="bg-white border-y border-royal-primary/5">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-2xl font-bold text-royal-dark sm:text-3xl">
                Royal Biology ගුරුවරයා
              </h2>
              <p className="mt-4 text-royal-text/80 leading-relaxed">
                අත්දැකීම් සහිත Biology ගුරුවරයෙකු විසින් මෙහෙයවනු ලබන 2027 Revision
                පන්තිය. Syllabus එකෙන් එක විස්තරාත්මකව, paper discussion සහ
                exam-oriented teaching.
              </p>
              <ul className="mt-6 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-royal-primary" />
                  සම්පූර්ණ A/L Biology Syllabus
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-royal-primary" />
                  Past Paper & Model Paper Discussions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-royal-primary" />
                  Continuous Assessment & Feedback
                </li>
              </ul>
            </div>
            <div className="flex justify-center">
              <div className="card w-full max-w-sm text-center">
                <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-royal-light text-4xl font-bold text-royal-primary">
                  RB
                </div>
                <h3 className="text-lg font-bold text-royal-dark">Royal Biology Team</h3>
                <p className="text-sm text-royal-text/70">Senior Biology Lecturer</p>
                <p className="mt-3 text-xs text-royal-text/60">
                  (Teacher photo & details can be updated in Admin Settings)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="card overflow-hidden bg-gradient-to-r from-royal-primary to-royal-dark p-0 text-white">
          <div className="px-6 py-12 text-center sm:px-12">
            <h2 className="text-2xl font-bold sm:text-3xl">
              2027 Revision පන්තියට අදම සම්බන්ධ වන්න
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/80">
              Registration කර, payment approve වූ පසු Recorded lessons, Notes සහ
              සියලු features unlock වේ.
            </p>
            <Link
              href="/register"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-royal-primary shadow-lg transition hover:bg-royal-light"
            >
              Register Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-royal-primary/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <h2 className="text-center text-xl font-bold text-royal-dark">සම්බන්ධ වන්න</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="flex items-center gap-3 justify-center">
              <Phone className="h-5 w-5 text-royal-primary" />
              <span className="text-sm">+94 XX XXX XXXX</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Mail className="h-5 w-5 text-royal-primary" />
              <span className="text-sm">info@royalbiology.lk</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <MapPin className="h-5 w-5 text-royal-primary" />
              <span className="text-sm">Colombo, Sri Lanka</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-royal-primary/10 bg-royal-dark text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-sm font-bold">
                RB
              </div>
              <span className="font-semibold">Royal Biology</span>
            </div>
            <p className="text-xs text-white/60">
              © {new Date().getFullYear()} Royal Biology. 2027 Revision. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
