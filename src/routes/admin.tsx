"use client";

import { createFileRoute, Link } from "@tanstack/react-router";
import { useRoutine, newId, defaultRoutine, type Routine } from "@/lib/routine-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin")({
  component: Admin,
  head: () => ({ meta: [{ title: "Admin · Rotina Semanal" }] }),
});

function Admin() {
  const [routine, setRoutine, isLoading] = useRoutine();

  const defaultTheme = defaultRoutine.theme ?? {
    headerFrom: "#f39ca8",
    headerTo: "#f6d1e5",
    periodBg: "#fde8f2",
    rowAlt: "#ffe6f0",
  };

  const update = (fn: (r: Routine) => Routine) => setRoutine(fn(structuredClone(routine)));

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header
          className="rounded-2xl p-6 mb-6 flex flex-wrap items-center justify-between gap-4 text-white"
          style={{ background: `linear-gradient(135deg, ${routine.theme?.headerFrom || 'var(--header-from)'}, ${routine.theme?.headerTo || 'var(--header-to)'})` }}
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Editor da Rotina</h1>
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

        <section className="bg-card rounded-2xl p-5 mb-6 shadow-sm space-y-3">
          <h2 className="font-semibold text-foreground">Cores do Tema</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Cor Primária (Início)</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  className="w-8 h-8 rounded cursor-pointer"
                  value={routine.theme?.headerFrom || defaultTheme.headerFrom}
                  onChange={(e) => update((r) => ({ ...r, theme: { ...r.theme, headerFrom: e.target.value, headerTo: r.theme?.headerTo || defaultTheme.headerTo, periodBg: r.theme?.periodBg || defaultTheme.periodBg, rowAlt: r.theme?.rowAlt || defaultTheme.rowAlt } }))}
                />
                <Input
                  className="flex-1"
                  value={routine.theme?.headerFrom || defaultTheme.headerFrom}
                  onChange={(e) => update((r) => ({ ...r, theme: { ...r.theme, headerFrom: e.target.value, headerTo: r.theme?.headerTo || defaultTheme.headerTo, periodBg: r.theme?.periodBg || defaultTheme.periodBg, rowAlt: r.theme?.rowAlt || defaultTheme.rowAlt } }))}
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Cor Primária (Fim)</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  className="w-8 h-8 rounded cursor-pointer"
                  value={routine.theme?.headerTo || defaultTheme.headerTo}
                  onChange={(e) => update((r) => ({ ...r, theme: { ...r.theme, headerTo: e.target.value, headerFrom: r.theme?.headerFrom || defaultTheme.headerFrom, periodBg: r.theme?.periodBg || defaultTheme.periodBg, rowAlt: r.theme?.rowAlt || defaultTheme.rowAlt } }))}
                />
                <Input
                  className="flex-1"
                  value={routine.theme?.headerTo || defaultTheme.headerTo}
                  onChange={(e) => update((r) => ({ ...r, theme: { ...r.theme, headerTo: e.target.value, headerFrom: r.theme?.headerFrom || defaultTheme.headerFrom, periodBg: r.theme?.periodBg || defaultTheme.periodBg, rowAlt: r.theme?.rowAlt || defaultTheme.rowAlt } }))}
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Fundo dos Períodos</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  className="w-8 h-8 rounded cursor-pointer"
                  value={routine.theme?.periodBg || defaultTheme.periodBg}
                  onChange={(e) => update((r) => ({ ...r, theme: { ...r.theme, periodBg: e.target.value, headerFrom: r.theme?.headerFrom || defaultTheme.headerFrom, headerTo: r.theme?.headerTo || defaultTheme.headerTo, rowAlt: r.theme?.rowAlt || defaultTheme.rowAlt } }))}
                />
                <Input
                  className="flex-1"
                  value={routine.theme?.periodBg || defaultTheme.periodBg}
                  onChange={(e) => update((r) => ({ ...r, theme: { ...r.theme, periodBg: e.target.value, headerFrom: r.theme?.headerFrom || defaultTheme.headerFrom, headerTo: r.theme?.headerTo || defaultTheme.headerTo, rowAlt: r.theme?.rowAlt || defaultTheme.rowAlt } }))}
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Fundo Linhas Pares</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  className="w-8 h-8 rounded cursor-pointer"
                  value={routine.theme?.rowAlt || defaultTheme.rowAlt}
                  onChange={(e) => update((r) => ({ ...r, theme: { ...r.theme, rowAlt: e.target.value, headerFrom: r.theme?.headerFrom || defaultTheme.headerFrom, headerTo: r.theme?.headerTo || defaultTheme.headerTo, periodBg: r.theme?.periodBg || defaultTheme.periodBg } }))}
                />
                <Input
                  className="flex-1"
                  value={routine.theme?.rowAlt || defaultTheme.rowAlt}
                  onChange={(e) => update((r) => ({ ...r, theme: { ...r.theme, rowAlt: e.target.value, headerFrom: r.theme?.headerFrom || defaultTheme.headerFrom, headerTo: r.theme?.headerTo || defaultTheme.headerTo, periodBg: r.theme?.periodBg || defaultTheme.periodBg } }))}
                />
              </div>
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
