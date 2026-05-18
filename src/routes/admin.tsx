import { createFileRoute, Link } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import { useRoutine, newId, defaultRoutine, type Routine } from "@/lib/routine-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? "";

export const Route = createFileRoute("/admin")({
  component: Admin,
  head: () => ({ meta: [{ title: "Admin · Rotina Semanal" }] }),
});

function Admin() {
  const [routine, setRoutine, isLoading] = useRoutine();
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && window.sessionStorage.getItem("admin_authenticated") === "true") {
      setAuthenticated(true);
    }
  }, []);

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!ADMIN_PASSWORD) {
      setError("A configuração do admin não está definida. Configure VITE_ADMIN_PASSWORD.");
      return;
    }

    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError("");
      window.sessionStorage.setItem("admin_authenticated", "true");
      return;
    }

    setError("Senha incorreta. Tente novamente.");
  };

  const update = (fn: (r: Routine) => Routine) => setRoutine(fn(structuredClone(routine)));

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-xl mx-auto">
          <div
            className="rounded-2xl p-8 text-center text-white shadow-lg"
            style={{ background: "linear-gradient(135deg, var(--header-from), var(--header-to))" }}
          >
            <h1 className="text-3xl font-bold">🔒 Acesso restrito</h1>
            <p className="mt-3 text-white/80">Digite a senha para acessar o editor da rotina.</p>
          </div>

          <form
            onSubmit={handleLogin}
            className="mt-8 rounded-2xl bg-card p-6 shadow-sm space-y-4"
          >
            <div>
              <label className="text-xs text-muted-foreground">Senha</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>

            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : (
              <p className="text-sm text-muted-foreground">A senha foi solicitada para proteger o acesso ao admin.</p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent"
              >
                ← Voltar
              </Link>
              <Button type="submit">Entrar</Button>
            </div>
          </form>
        </div>
      </div>
  );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header
          className="rounded-2xl p-6 mb-6 flex flex-wrap items-center justify-between gap-4 text-white"
          style={{ background: "linear-gradient(135deg, var(--header-from), var(--header-to))" }}
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">⚙️ Editor da Rotina</h1>
            <p className="text-white/80 text-sm">
              Altere horários, tarefas e períodos.
              {isLoading && <span className="ml-2 opacity-60">(Salvando/Carregando na nuvem...)</span>}
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/" className="px-4 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-white text-sm font-medium">← Ver rotina</Link>
            <button
              className="px-4 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-white text-sm font-medium"
              onClick={() => {
                if (confirm("Restaurar a rotina padrão? Suas alterações serão perdidas.")) {
                  resetRoutine();
                  setRoutine(defaultRoutine);
                }
              }}
            >
              ↺ Restaurar padrão
            </button>
          </div>
        </header>

        <section className="bg-card rounded-2xl p-5 mb-6 shadow-sm space-y-3">
          <h2 className="font-semibold text-foreground">Cabeçalho</h2>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Título</label>
              <Input
                value={routine.title}
                onChange={(e) => update((r) => ({ ...r, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Subtítulo</label>
              <Input
                value={routine.subtitle}
                onChange={(e) => update((r) => ({ ...r, subtitle: e.target.value }))}
              />
            </div>
          </div>
        </section>

        <section className="bg-card rounded-2xl p-5 mb-6 shadow-sm">
          <h2 className="font-semibold text-foreground mb-3">Dias da semana</h2>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
            {routine.days.map((d, i) => (
              <Input
                key={i}
                value={d}
                onChange={(e) =>
                  update((r) => {
                    r.days[i] = e.target.value;
                    return r;
                  })
                }
              />
            ))}
          </div>
        </section>

        {routine.periods.map((period, pi) => (
          <section key={period.id} className="bg-card rounded-2xl p-5 mb-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Input
                className="max-w-xs font-semibold"
                value={period.label}
                onChange={(e) =>
                  update((r) => {
                    r.periods[pi].label = e.target.value;
                    return r;
                  })
                }
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  update((r) => {
                    r.periods.splice(pi, 1);
                    return r;
                  })
                }
              >
                🗑 Remover período
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="p-2 w-28">Horário</th>
                    {routine.days.map((d) => (
                      <th key={d} className="p-2 font-medium text-muted-foreground">{d}</th>
                    ))}
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {period.rows.map((row, ri) => (
                    <tr key={row.id} className="align-top">
                      <td className="p-1">
                        <Input
                          value={row.time}
                          onChange={(e) =>
                            update((r) => {
                              r.periods[pi].rows[ri].time = e.target.value;
                              return r;
                            })
                          }
                        />
                      </td>
                      {row.cells.map((c, ci) => (
                        <td key={ci} className="p-1">
                          <Input
                            value={c}
                            placeholder="—"
                            onChange={(e) =>
                              update((r) => {
                                r.periods[pi].rows[ri].cells[ci] = e.target.value;
                                return r;
                              })
                            }
                          />
                        </td>
                      ))}
                      <td className="p-1">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            disabled={ri === 0}
                            title="Mover para cima"
                            onClick={() =>
                              update((r) => {
                                const rows = r.periods[pi].rows;
                                const temp = rows[ri];
                                rows[ri] = rows[ri - 1];
                                rows[ri - 1] = temp;
                                return r;
                              })
                            }
                          >
                            ↑
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            disabled={ri === period.rows.length - 1}
                            title="Mover para baixo"
                            onClick={() =>
                              update((r) => {
                                const rows = r.periods[pi].rows;
                                const temp = rows[ri];
                                rows[ri] = rows[ri + 1];
                                rows[ri + 1] = temp;
                                return r;
                              })
                            }
                          >
                            ↓
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                            title="Remover horário"
                            onClick={() =>
                              update((r) => {
                                r.periods[pi].rows.splice(ri, 1);
                                return r;
                              })
                            }
                          >
                            ✕
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() =>
                update((r) => {
                  r.periods[pi].rows.push({
                    id: newId(),
                    time: "00:00",
                    cells: Array(r.days.length).fill("—"),
                  });
                  return r;
                })
              }
            >
              ➕ Adicionar horário
            </Button>
          </section>
        ))}

        <div className="text-center">
          <Button
            onClick={() =>
              update((r) => {
                r.periods.push({
                  id: newId(),
                  label: "🌟 Novo período",
                  rows: [],
                });
                return r;
              })
            }
          >
            ➕ Adicionar período
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          As alterações são salvas automaticamente no navegador.
        </p>
      </div>
    </div>
  );
}