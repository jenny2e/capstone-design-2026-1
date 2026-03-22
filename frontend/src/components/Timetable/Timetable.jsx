import { useEffect, useState } from 'react';

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 8); // 8:00 ~ 21:00
const HOUR_PX = 60;
const START_HOUR = 8;

function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function hasConflict(schedule, allSchedules) {
  const sMin = timeToMinutes(schedule.start_time);
  const eMin = timeToMinutes(schedule.end_time);
  return allSchedules.some(
    (other) =>
      other.id !== schedule.id &&
      other.day_of_week === schedule.day_of_week &&
      timeToMinutes(other.start_time) < eMin &&
      timeToMinutes(other.end_time) > sMin
  );
}

function ScheduleBlock({ schedule, allSchedules, onDelete, onEdit }) {
  const [hovered, setHovered] = useState(false);
  const startMin = timeToMinutes(schedule.start_time);
  const endMin = timeToMinutes(schedule.end_time);
  const top = ((startMin - START_HOUR * 60) / 60) * HOUR_PX;
  const height = Math.max(((endMin - startMin) / 60) * HOUR_PX, 20);
  const color = schedule.color || '#3B66CC';
  const conflict = hasConflict(schedule, allSchedules);
  const isUrgent = schedule.priority === 2;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        top: `${top}px`,
        height: `${height}px`,
        left: '4px',
        right: '4px',
        background: conflict
          ? `linear-gradient(160deg, ${color}DD, ${color}99)`
          : `linear-gradient(160deg, ${color}F2, ${color}CC)`,
        borderLeft: `3.5px solid ${conflict ? '#ba1a1a' : isUrgent ? '#F97316' : color}`,
        borderRadius: '0 10px 10px 0',
        outline: conflict ? '1.5px dashed rgba(186,26,26,0.6)' : 'none',
        padding: '4px 7px',
        overflow: 'hidden',
        cursor: 'pointer',
        zIndex: 1,
        boxSizing: 'border-box',
        boxShadow: conflict
          ? `0 4px 12px rgba(186,26,26,0.25), inset 0 1px 0 rgba(255,255,255,0.15)`
          : `0 2px 8px ${color}33, inset 0 1px 0 rgba(255,255,255,0.2)`,
        transform: hovered ? 'translateY(-1px) scaleX(1.01)' : 'none',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
      }}
      onClick={() => onEdit && onEdit(schedule)}
    >
      {conflict && (
        <div style={{ position: 'absolute', top: 2, left: 4, fontSize: 9, color: '#ba1a1a', fontWeight: 700 }}>
          ⚠
        </div>
      )}
      {isUrgent && !conflict && (
        <div style={{ position: 'absolute', top: 2, left: 4, fontSize: 9, color: '#F97316' }}>●</div>
      )}
      <div style={{ color: 'white', fontSize: '11px', fontWeight: 700, lineHeight: 1.3, paddingLeft: conflict || isUrgent ? 12 : 0, fontFamily: "'Inter', sans-serif" }}>
        {schedule.title}
      </div>
      <div style={{ color: 'rgba(255,255,255,0.88)', fontSize: '10px' }}>
        {schedule.start_time}~{schedule.end_time}
      </div>
      {schedule.location && (
        <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '10px' }}>{schedule.location}</div>
      )}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm(`'${schedule.title}' 일정을 삭제할까요?`)) onDelete(schedule.id);
          }}
          style={{
            position: 'absolute', top: 3, right: 3,
            background: 'rgba(0,0,0,0.18)', backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)',
            color: 'white', border: 'none', borderRadius: '50%',
            width: 16, height: 16, cursor: 'pointer', fontSize: 11,
            lineHeight: '16px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}

export default function Timetable({ schedules = [], onDelete, onEdit }) {
  const totalHeight = HOURS.length * HOUR_PX;

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const today = new Date();
  const todayDow = today.getDay() === 0 ? 6 : today.getDay() - 1;

  const currentTimeMin = now.getHours() * 60 + now.getMinutes();
  const currentTimeTop = ((currentTimeMin - START_HOUR * 60) / 60) * HOUR_PX;
  const showTimeLine = currentTimeMin >= START_HOUR * 60 && currentTimeMin <= (START_HOUR + HOURS.length) * 60;

  const mondayOffset = todayDow;
  const weekDates = DAYS.map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - mondayOffset + i);
    return d.toISOString().slice(0, 10);
  });

  const getColumnSchedules = (dayIndex) => {
    return schedules.filter((s) => {
      if (s.date) {
        return s.date === weekDates[dayIndex];
      }
      return s.day_of_week === dayIndex;
    });
  };

  const conflictCount = schedules.filter((s) => hasConflict(s, schedules)).length;

  return (
    <div>
      {conflictCount > 0 && (
        <div style={{
          padding: '9px 18px',
          background: '#ffdad6',
          borderBottom: '1px solid rgba(186,26,26,0.15)',
          fontSize: 12,
          color: '#ba1a1a',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontFamily: "'Inter', sans-serif",
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>warning</span>
          {conflictCount}개의 일정이 시간 충돌 상태입니다.
        </div>
      )}
      <div style={{ overflowX: 'auto', userSelect: 'none' }}>
        <div style={{ display: 'flex', minWidth: 580 }}>
          {/* Time column */}
          <div style={{ width: 48, flexShrink: 0 }}>
            <div style={{ height: 44 }} />
            <div style={{ position: 'relative', height: totalHeight }}>
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  style={{
                    position: 'absolute',
                    top: (hour - START_HOUR) * HOUR_PX - 7,
                    right: 6,
                    fontSize: 11,
                    color: '#747684',
                    whiteSpace: 'nowrap',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {hour}:00
                </div>
              ))}
            </div>
          </div>

          {/* Day columns */}
          {DAYS.map((day, dayIndex) => {
            const colSchedules = getColumnSchedules(dayIndex);
            const isToday = dayIndex === todayDow;
            const isSat = dayIndex === 5;
            const isSun = dayIndex === 6;
            return (
              <div key={dayIndex} style={{ flex: 1, minWidth: 70 }}>
                {/* Header */}
                <div style={{
                  height: 44,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 12,
                  color: isToday ? '#3B66CC' : isSat ? '#2563EB' : isSun ? '#ba1a1a' : '#434653',
                  backgroundColor: isToday ? '#f1f4f7' : '#fafafa',
                  borderLeft: '1px solid #f0f3f7',
                  borderBottom: isToday ? '2.5px solid #3B66CC' : '1.5px solid #e5e8eb',
                  lineHeight: 1.2,
                  fontFamily: "'Inter', sans-serif",
                }}>
                  <span style={{ fontSize: isToday ? 13 : 12 }}>{day}</span>
                  <span style={{
                    fontSize: 10,
                    color: isToday ? '#3B66CC' : '#c3c6d5',
                    fontWeight: isToday ? 700 : 400,
                    background: isToday ? '#dae1ff' : 'transparent',
                    borderRadius: 4,
                    padding: isToday ? '1px 5px' : 0,
                    marginTop: 1,
                  }}>
                    {weekDates[dayIndex]?.slice(5)}
                  </span>
                </div>

                {/* Grid */}
                <div
                  className={isToday ? 'today-col' : ''}
                  style={{ position: 'relative', height: totalHeight, borderLeft: '1px solid #f0f3f7' }}
                >
                  {HOURS.map((hour) => (
                    <div
                      key={hour}
                      style={{
                        position: 'absolute',
                        top: (hour - START_HOUR) * HOUR_PX,
                        left: 0, right: 0,
                        borderTop: hour % 2 === 0 ? '1px solid #ebeef1' : '1px dashed #f1f4f7',
                      }}
                    />
                  ))}

                  {/* Current time indicator */}
                  {isToday && showTimeLine && (
                    <div style={{ position: 'absolute', top: currentTimeTop, left: 0, right: 0, zIndex: 5, display: 'flex', alignItems: 'center' }}>
                      <div className="time-dot" style={{ width: 9, height: 9, borderRadius: '50%', background: '#3B66CC', flexShrink: 0, boxShadow: '0 0 0 3px rgba(59,102,204,0.2)' }} />
                      <div style={{ flex: 1, height: 2, background: 'linear-gradient(90deg, #3B66CC, rgba(59,102,204,0.15))' }} />
                    </div>
                  )}

                  {colSchedules.map((schedule) => (
                    <ScheduleBlock
                      key={schedule.id}
                      schedule={schedule}
                      allSchedules={colSchedules}
                      onDelete={onDelete}
                      onEdit={onEdit}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
