import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Fragment } from "react";
import { useRoutine } from "@/lib/routine-store";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Minha Rotina Semanal" },
      { name: "description", content: "Rotina semanal organizada por horários e dias." },
    ],
  }),
});

function Index() {
  const [routine, , isLoading] = useRoutine();
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header
          className="rounded-2xl p-8 mb-6 text-center text-white shadow-lg"
          style={{ background: `linear-gradient(135deg, ${routine.theme?.headerFrom || 'var(--header-from)'}, ${routine.theme?.headerTo || 'var(--header-to)'})` }}
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            ⚡ {routine.title} 🔱
          </h1>
          <p className="mt-2 text-white/90">
            {routine.subtitle}
            {isLoading && <span className="ml-2 text-xs opacity-50">(Carregando nuvem...)</span>}
          </p>
        </header>

        <div className="overflow-x-auto rounded-2xl shadow-md bg-card">
          <table className="w-full border-collapse min-w-[900px]">
            <thead>
              <tr>
                <th
                  className="p-4 text-white font-semibold text-left rounded-tl-2xl"
                  style={{ background: `linear-gradient(135deg, ${routine.theme?.headerFrom || 'var(--time-from)'}, ${routine.theme?.headerTo || 'var(--time-to)'})` }}
                >
                  Horário
                </th>
                {routine.days.map((d, i) => (
                  <th
                    key={d}
                    className={`p-4 text-white font-semibold ${i === routine.days.length - 1 ? "rounded-tr-2xl" : ""}`}
                    style={{ background: `linear-gradient(135deg, ${routine.theme?.headerFrom || 'var(--header-from)'}, ${routine.theme?.headerTo || 'var(--header-to)'})` }}
                  >
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {routine.periods.map((period) => (
                <Fragment key={period.id}>
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-3 font-semibold tracking-wide uppercase text-sm"
                      style={{ background: routine.theme?.periodBg || "var(--period-bg)", color: "var(--foreground)" }}
                    >
                      {period.label}
                    </td>
                  </tr>
                  {period.rows.map((row, ri) => (
                    <tr key={row.id} style={{ background: ri % 2 === 0 ? "transparent" : (routine.theme?.rowAlt || "var(--row-alt)") }}>
                      <td
                        className="p-3 text-white font-semibold text-center"
                        style={{ background: `linear-gradient(135deg, ${routine.theme?.headerFrom || 'var(--time-from)'}, ${routine.theme?.headerTo || 'var(--time-to)'})` }}
                      >
                        {row.time}
                      </td>
                      {row.cells.map((c, i) => (
                        <td key={i} className="p-3 text-center text-sm border-b border-border">
                          {c && c !== "—" ? (
                            <span className="font-medium text-foreground">{c}</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
          >
            ⚙️ Editar rotina
          </Link>
        </div>
      </div>
    </div>
  );
}
