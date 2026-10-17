import { useEffect, useMemo, useRef, useState } from "react";
import {
  CATEGORIES,
  DAYS,
  clearDay,
  dayIdFromDate,
  getDayStats,
  getWeekStats,
  loadCompleted,
  saveCompleted,
} from "./data/schedule.js";
import ProgressBar from "./components/ProgressBar.jsx";
import TaskRow from "./components/TaskRow.jsx";
import ConfirmDialog from "./components/ConfirmDialog.jsx";

/** Motivational message driven by real completion progress (0–100). */
export function motivationFor(pct) {
  if (pct >= 100) return "You did it! Celebrate every little win. 🎀";
  if (pct >= 75) return "Almost there — keep going, you’re doing beautifully. ✨";
  if (pct >= 50) return "Look at you showing up for yourself. ✨";
  if (pct >= 25) return "You’re building momentum, one task at a time. 🌷";
  if (pct > 0) return "Every little checkmark counts. ☕";
  return "A fresh page and a fresh start. 🤍";
}

export default function App() {
  // Live clock — recalculates "today" automatically at midnight.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const todayId = dayIdFromDate(now);
  const [selectedDayId, setSelectedDayId] = useState(() =>
    dayIdFromDate(new Date())
  );
  const [completed, setCompleted] = useState(() => sanitize(loadCompleted));
  const [confirmAction, setConfirmAction] = useState(null); // {type: 'day'|'week'}
  const [saveVisible, setSaveVisible] = useState(false);
  const saveTimer = useRef(null);

  function sanitize(loader) {
    try {
      return loader();
    } catch {
      return {};
    }
  }

  // Autosave after every checkbox change (skip the initial restore,
  // including React StrictMode's double-invoked mount effect).
  const savedSoFar = useRef(completed);
  useEffect(() => {
    if (Object.is(savedSoFar.current, completed)) return;
    savedSoFar.current = completed;
    saveCompleted(completed);
    setSaveVisible(true);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setSaveVisible(false), 1800);
    return () => clearTimeout(saveTimer.current);
  }, [completed]);

  const selectedDay = DAYS.find((d) => d.id === selectedDayId) ?? DAYS[0];

  const perDay = useMemo(
    () => DAYS.map((d) => ({ ...d, stats: getDayStats(d, completed) })),
    [completed]
  );
  const week = useMemo(() => getWeekStats(completed), [completed]);
  const selectedStats = getDayStats(selectedDay, completed);

  const toggleTask = (id) =>
    setCompleted((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });

  const confirmResetDay = () =>
    setConfirmAction({
      type: "day",
      title: `Reset ${selectedDay.name} 🎀`,
      message: `This will uncheck every task for ${selectedDay.name} only. Your other days stay exactly as they are.`,
      confirmLabel: "Yes, reset this day",
    });

  const confirmResetWeek = () =>
    setConfirmAction({
      type: "week",
      title: "Reset the whole week 🤍",
      message:
        "This will clear every completed checkbox across all seven days. This cannot be undone.",
      confirmLabel: "Yes, reset everything",
    });

  const handleConfirm = () => {
    if (confirmAction?.type === "day") {
      setCompleted((prev) => clearDay(prev, selectedDayId));
    } else {
      setCompleted({});
    }
    setConfirmAction(null);
  };

  const dateLabel = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timeLabel = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="page">
      {/* ---------- welcome dashboard ---------- */}
      <header className="hero card" id="top">
        <span className="hero__blob hero__blob--1" aria-hidden="true" />
        <span className="hero__blob hero__blob--2" aria-hidden="true" />
        <div className="hero__content">
          <p className="hero__eyebrow">Weekly planner</p>
          <h1 className="hero__title">
            Mariam’s Little Weekly Planner <span aria-hidden="true">🎀</span>
          </h1>
          <p className="hero__sub">
            Your cozy space to plan, focus, and take care of yourself.
          </p>
          <p className="hero__date">
            <time dateTime={now.toISOString()}>{dateLabel}</time>
            <span className="hero__dot" aria-hidden="true">
              ·
            </span>
            {timeLabel}
          </p>
          <p className={saveVisible ? "save-chip save-chip--show" : "save-chip"} role="status">
            {saveVisible ? "Progress saved ✓" : ""}
          </p>
          <p className="hero__msg">{motivationFor(week.pct)}</p>
        </div>
        <div className="hero__art" aria-hidden="true">
          <div className="hero__ball hero__ball--lg">
            <span>☕</span>
          </div>
          <div className="hero__ball hero__ball--sm">
            <span>🎀</span>
          </div>
          <span className="hero__spark hero__spark--1">✨</span>
          <span className="hero__spark hero__spark--2">🌸</span>
          <span className="hero__spark hero__spark--3">🤍</span>
        </div>
      </header>

      {/* ---------- dashboard statistics ---------- */}
      <section className="stats" aria-label="Progress statistics">
        <article className="card stat">
          <h2 className="stat__k">Weekly completion</h2>
          <p className="stat__v">
            {week.pct}
            <span className="stat__unit">%</span>
          </p>
          <p className="stat__hint">
            Across all 7 days · every task counted once
          </p>
        </article>
        <article className="card stat">
          <h2 className="stat__k">Tasks completed</h2>
          <p className="stat__v">
            {week.done}
            <span className="stat__of"> / {week.total}</span>
          </p>
          <p className="stat__hint">
            {week.total - week.done} {week.total - week.done === 1 ? "task" : "tasks"} left this week
          </p>
        </article>
        <article className="card stat">
          <h2 className="stat__k">Selected day — {selectedDay.name}</h2>
          <p className="stat__v">
            {selectedStats.pct}
            <span className="stat__unit">%</span>
          </p>
          <p className="stat__hint">
            {selectedStats.done} of {selectedStats.total} done
          </p>
        </article>
        <article className="card stat stat--bar">
          <div className="stat__bar-row">
            <h2 className="stat__k stat__k--row">Weekly progress</h2>
            <span className="stat__pct">
              {week.done}/{week.total}
            </span>
          </div>
          <ProgressBar value={week.pct} height={12} label="Weekly progress" />
        </article>
      </section>

      {/* ---------- weekly navigation ---------- */}
      <nav className="daytabs card" aria-label="Days of the week">
        {perDay.map((d) => (
          <button
            key={d.id}
            type="button"
            className={
              "tab" + (d.id === selectedDayId ? " tab--active" : "")
            }
            aria-pressed={d.id === selectedDayId}
            onClick={() => setSelectedDayId(d.id)}
          >
            {d.id === todayId && <span className="tab__today">Today</span>}
            <span className="tab__day">
              <span aria-hidden="true">{d.emoji}</span>
              {d.name}
            </span>
            <span className="tab__pct">{d.stats.pct}%</span>
            <ProgressBar
              value={d.stats.pct}
              height={5}
              className="bar--mini"
              label={`${d.name} progress`}
            />
          </button>
        ))}
      </nav>

      <div className="layout">
        {/* ---------- main schedule ---------- */}
        <section className="card schedule" aria-label={`Schedule for ${selectedDay.name}`}>
          <header className="schedule__head">
            <div className="schedule__heading">
              <h2 className="schedule__title">
                <span aria-hidden="true">{selectedDay.emoji}</span>{" "}
                {selectedDay.name}
                {selectedDayId === todayId && (
                  <span className="badge-today">Today</span>
                )}
              </h2>
              <p className="schedule__sub">
                {selectedStats.done} of {selectedStats.total} done ·{" "}
                <strong>{selectedStats.pct}%</strong>
              </p>
            </div>
            <div className="schedule__actions">
              <button type="button" className="btn" onClick={confirmResetDay}>
                Reset this day
              </button>
              <button type="button" className="btn btn--ghost" onClick={confirmResetWeek}>
                Reset all tasks
              </button>
            </div>
          </header>
          <ProgressBar
            value={selectedStats.pct}
            height={8}
            className="schedule__bar"
            label={`${selectedDay.name} progress`}
          />
          <ol className="tasklist">
            {selectedDay.tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                done={!!completed[task.id]}
                onToggle={() => toggleTask(task.id)}
              />
            ))}
          </ol>
        </section>

        {/* ---------- sidebar ---------- */}
        <aside className="side">
          <section className="card panel" aria-label="Weekly overview">
            <h3 className="panel__title">Weekly overview</h3>
            <div className="ov">
              {perDay.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className={
                    "ov-day" + (d.id === selectedDayId ? " ov-day--active" : "")
                  }
                  aria-current={d.id === selectedDayId ? "true" : undefined}
                  onClick={() => setSelectedDayId(d.id)}
                >
                  <span className="ov-row">
                    <span className="ov-name">
                      <span aria-hidden="true">{d.emoji}</span> {d.name}
                      {d.id === todayId && (
                        <span className="badge-today badge-today--mini">Today</span>
                      )}
                    </span>
                    <span className="ov-pct">{d.stats.pct}%</span>
                  </span>
                  <ProgressBar
                    value={d.stats.pct}
                    height={6}
                    className="bar--mini"
                    label={`${d.name} progress`}
                  />
                </button>
              ))}
            </div>
          </section>

          <section className="card panel" aria-label="Motivation">
            <h3 className="panel__title">A little motivation 🤍</h3>
            <p className="motive__msg">{motivationFor(selectedStats.pct)}</p>
            <p className="motive__sub">
              For {selectedDay.name} — {selectedStats.done}/{selectedStats.total} done
            </p>
          </section>

          <section className="card panel" aria-label="Category legend">
            <h3 className="panel__title">Categories</h3>
            <ul className="legend">
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <li key={key}>
                  <i style={{ background: cat.color }} aria-hidden="true" />
                  {cat.label}
                </li>
              ))}
            </ul>
          </section>

          <section className="card panel panel--note" aria-label="About saving">
            <h3 className="panel__title">Save &amp; sync 💾</h3>
            <p className="note__text">
              Progress is saved automatically in this browser
              (localStorage). It stays on this device and is{" "}
              <strong>not synchronized</strong> across devices or browsers.
            </p>
          </section>
        </aside>
      </div>

      <footer className="footer">
        Made with 🤍 for Mariam · Mariam’s Little Weekly Planner 🎀
      </footer>

      {confirmAction && (
        <ConfirmDialog
          title={confirmAction.title}
          message={confirmAction.message}
          confirmLabel={confirmAction.confirmLabel}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
}
