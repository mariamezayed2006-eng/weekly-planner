import { CATEGORIES } from "../data/schedule.js";

export default function TaskRow({ task, done, onToggle }) {
  const cat = CATEGORIES[task.cat];
  return (
    <li className={`task${done ? " task--done" : ""}`}>
      <span
        className="task__accent"
        style={{ background: cat.color }}
        aria-hidden="true"
      />
      <label className="task__body">
        <input
          type="checkbox"
          className="task__check"
          checked={done}
          onChange={onToggle}
          aria-label={`${task.activity} — ${task.time}`}
        />
        <span className="task__box" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              className="task__tick"
              d="M2.5 8.5 6 12l7.5-8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength="1"
            />
          </svg>
        </span>
        <span className="task__time">{task.time}</span>
        <span className="task__name">{task.activity}</span>
        <span className="task__cat">
          <i style={{ background: cat.color }} aria-hidden="true" />
          <span className="task__cat-label">{cat.label}</span>
        </span>
      </label>
    </li>
  );
}
